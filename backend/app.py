
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from typing import Optional, BinaryIO
import traceback
import json
from pathlib import Path
import asyncio
from datetime import datetime
import os

from generators.content_generator import ContentGenerator
from generators.script_generator import ScriptGenerator
from generators.manim_generator import ManimGenerator
from generators.voice_generator import VoiceGenerator
from generators.image_fetcher import ImageFetcher
from utils.video_renderer import VideoRenderer
from utils.video_composer import VideoComposer
from utils.slide_renderer import SlideRenderer
from config import Config

app = FastAPI(title="Combined Video PPT Generator")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    topic: str
    num_slides: int = 5
    language: str = "english"
    tone: str = "formal"

class GenerateResponse(BaseModel):
    status: str
    message: str
    content_data: Optional[dict] = None
    script_data: Optional[dict] = None
    video_path: Optional[str] = None
    video_filename: Optional[str] = None

# Store generation status
generation_status = {}

def update_progress(generation_id: str, progress: int, status: str, message: str):
    """Update progress and print to terminal"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    generation_status[generation_id] = {
        "status": status,
        "progress": progress,
        "message": message,
        "timestamp": timestamp
    }
    print(f"[{timestamp}] {message}")

# ===== VIDEO STREAMING WITH RANGE REQUEST SUPPORT =====
def send_bytes_range_requests(
    file_obj: BinaryIO, start: int, end: int, chunk_size: int = 10_000
):
    """Send a file in chunks using Range Requests specification RFC7233"""
    with file_obj as f:
        f.seek(start)
        while (pos := f.tell()) <= end:
            read_size = min(chunk_size, end + 1 - pos)
            yield f.read(read_size)

def _get_range_header(range_header: str, file_size: int) -> tuple[int, int]:
    """Parse range header and return start, end positions"""
    def _invalid_range():
        return HTTPException(
            416,
            detail=f"Invalid request range (Range:{range_header!r})",
        )

    try:
        h = range_header.replace("bytes=", "").split("-")
        start = int(h[0]) if h[0] != "" else 0
        end = int(h[1]) if h[1] != "" else file_size - 1
    except ValueError:
        raise _invalid_range()

    if start > end or start < 0 or end > file_size - 1:
        raise _invalid_range()
    return start, end

def range_requests_response(
    request: Request, file_path: str, content_type: str
):
    """Returns StreamingResponse using Range Requests of a given file"""
    file_size = os.stat(file_path).st_size
    range_header = request.headers.get("range")

    headers = {
        "content-type": content_type,
        "accept-ranges": "bytes",
        "content-encoding": "identity",
        "content-length": str(file_size),
        "access-control-expose-headers": (
            "content-type, accept-ranges, content-length, "
            "content-range, content-encoding"
        ),
    }
    start = 0
    end = file_size - 1
    status_code = 200

    if range_header is not None:
        start, end = _get_range_header(range_header, file_size)
        size = end - start + 1
        headers["content-length"] = str(size)
        headers["content-range"] = f"bytes {start}-{end}/{file_size}"
        status_code = 206

    return StreamingResponse(
        send_bytes_range_requests(open(file_path, mode="rb"), start, end),
        headers=headers,
        status_code=status_code,
    )
# ===== END VIDEO STREAMING =====

# ===== SSE ENDPOINT WITH PROPER STREAMING =====
@app.get("/api/progress/{generation_id}")
async def get_progress(generation_id: str):
    """SSE endpoint for real-time progress updates"""
    async def event_generator():
        print(f"[SSE] Client connected for generation_id: {generation_id}")
        last_message = None
        retry_count = 0
        max_retries = 600  # 5 minutes max
        
        # Send initial connection message immediately
        initial_msg = {
            'status': 'connected',
            'progress': 0,
            'message': '📡 Connected to progress stream',
            'timestamp': datetime.now().strftime("%H:%M:%S")
        }
        yield f"data: {json.dumps(initial_msg)}\n\n"
        
        while retry_count < max_retries:
            if generation_id in generation_status:
                status_data = generation_status[generation_id]
                
                current_message = status_data["message"]
                # Send update if message changed OR as heartbeat every 2 seconds
                if current_message != last_message or retry_count % 4 == 0:
                    last_message = current_message
                    data = json.dumps(status_data)
                    print(f"[SSE] 📤 Sending: {status_data['message'][:50]}")
                    yield f"data: {data}\n\n"
                
                # Stop if completed or failed
                if status_data["status"] in ["completed", "error"]:
                    print(f"[SSE] 🏁 Closing connection for {generation_id}")
                    # Send final done message
                    final_msg = {
                        'status': 'done',
                        'progress': 100,
                        'message': '✅ Stream ended',
                        'timestamp': datetime.now().strftime("%H:%M:%S")
                    }
                    yield f"data: {json.dumps(final_msg)}\n\n"
                    break
            else:
                # Send waiting message if generation hasn't started yet
                if retry_count < 10:  # Only send waiting message for first 5 seconds
                    waiting_msg = {
                        'status': 'waiting',
                        'progress': 0,
                        'message': '⏳ Waiting for generation to start...',
                        'timestamp': datetime.now().strftime("%H:%M:%S")
                    }
                    yield f"data: {json.dumps(waiting_msg)}\n\n"
            
            await asyncio.sleep(0.5)
            retry_count += 1
        
        print(f"[SSE] ❌ Timeout or closed for {generation_id}")
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "Content-Encoding": "none",  # CRITICAL for SSE!
        }
    )

# ===== TEST SSE ENDPOINT =====
@app.get("/api/test-sse")
async def test_sse():
    """Test SSE endpoint to verify streaming works"""
    async def event_generator():
        for i in range(10):
            data = {
                'count': i,
                'message': f'Test message {i}',
                'timestamp': datetime.now().strftime("%H:%M:%S")
            }
            print(f"[TEST-SSE] Sending: {data}")
            yield f"data: {json.dumps(data)}\n\n"
            await asyncio.sleep(1)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Encoding": "none",
        }
    )

@app.post("/api/generate")
async def generate_presentation(request: GenerateRequest, background_tasks: BackgroundTasks):
    """Main endpoint to generate presentation video"""
    
    try:
        topic = request.topic
        
        # Sanitize topic for file paths
        topic_clean = topic[:30].replace(' ', '_').replace(':', '').replace('/', '_').replace('\\', '_')
        topic_clean = topic_clean.replace('"', '').replace("'", '').replace('?', '').replace('!', '')
        
        generation_id = topic_clean
        
        # Initialize status
        update_progress(generation_id, 0, "started", "🚀 Starting generation...")
        
        # Step 1: Generate PPT content structure
        update_progress(generation_id, 10, "generating_content", "📝 Generating presentation content...")
        
        content_gen = ContentGenerator()
        content_data = content_gen.generate_content(topic, request.num_slides)
        
        # Step 2: Generate narration scripts with timestamps
        update_progress(generation_id, 20, "generating_scripts", "📜 Generating voice scripts...")
        
        script_gen = ScriptGenerator()
        script_data = script_gen.generate_scripts(content_data, request.language, request.tone)
        
        # Step 3: Generate voice audio PER SLIDE and get actual durations
        update_progress(generation_id, 30, "generating_audio", "🎤 Generating voice narration per slide...")
        
        voice_gen = VoiceGenerator()
        slide_audio_paths = {}
        actual_durations = {}
        total_slides = len(script_data['slide_scripts'])
        
        # Generate audio for each slide separately
        for idx, slide_script in enumerate(script_data['slide_scripts'], 1):
            slide_num = slide_script['slide_number']
            
            audio_progress = 30 + int((idx / total_slides) * 15)
            update_progress(generation_id, audio_progress, "generating_audio", 
                          f"🎤 Generating audio for slide {idx}/{total_slides}...")
            
            try:
                audio_path = voice_gen.generate_voice_for_slide(
                    slide_script['narration_text'],
                    slide_num,
                    topic,
                    request.language
                )
                slide_audio_paths[slide_num] = audio_path
                
                from moviepy import AudioFileClip
                audio_clip = AudioFileClip(audio_path)
                actual_durations[slide_num] = audio_clip.duration
                audio_clip.close()
                
                update_progress(generation_id, audio_progress, "generating_audio", 
                              f"✅ Generated audio for slide {idx}/{total_slides} ({actual_durations[slide_num]:.1f}s)")
                
            except Exception as e:
                print(f"Error generating audio for slide {slide_num}: {e}")
                actual_durations[slide_num] = slide_script['end_time'] - slide_script['start_time']
        
        # Update script timestamps based on actual audio durations
        current_time = 0
        for slide_script in script_data['slide_scripts']:
            slide_num = slide_script['slide_number']
            actual_duration = actual_durations.get(slide_num, slide_script['end_time'] - slide_script['start_time'])
            
            slide_script['start_time'] = current_time
            slide_script['end_time'] = current_time + actual_duration
            current_time += actual_duration
        
        script_data['total_duration'] = current_time
        
        # Combine all slide audios into one file
        update_progress(generation_id, 48, "combining_audio", "🎵 Combining audio tracks...")
        audio_path = voice_gen.combine_slide_audios(slide_audio_paths, topic)
        update_progress(generation_id, 49, "combining_audio", "✅ Audio tracks combined")
        
        # Step 4: Generate slide visuals - MUTUALLY EXCLUSIVE LOGIC
        update_progress(generation_id, 50, "generating_media", "🎨 Generating slide visuals...")
        
        manim_gen = ManimGenerator()
        image_fetcher = ImageFetcher()
        video_renderer = VideoRenderer()
        slide_renderer = SlideRenderer()
        
        slide_paths = {}
        animation_paths = {}
        image_paths = {}
        
        total_slides = len(content_data['slides'])
        for idx, slide in enumerate(content_data['slides'], 1):
            slide_num = slide['slide_number']
            visual_progress = 50 + int((idx / total_slides) * 30)
            
            # ENFORCE MUTUAL EXCLUSIVITY
            has_animation = slide.get('needs_animation', False)
            has_image = slide.get('needs_image', False)
            
            if has_animation and has_image:
                print(f"⚠️ ERROR: Slide {slide_num} has BOTH animation and image flags!")
                print(f"   Forcing fix: Animation takes priority")
                has_image = False
                slide['needs_image'] = False
                slide['image_keyword'] = ""
            
            # PRIORITY 1: Animation (if requested and no image)
            if has_animation and not has_image:
                update_progress(generation_id, visual_progress, "generating_animation",
                              f"🎬 Creating animation for slide {idx}/{total_slides}...")
                try:
                    slide_script = next(
                        (s for s in script_data['slide_scripts'] if s['slide_number'] == slide_num),
                        None
                    )
                    duration = slide_script['end_time'] - slide_script['start_time'] if slide_script else slide['duration']
                    
                    animation_code = manim_gen.generate_animation_code(slide, duration)
                    code_path = manim_gen.save_animation_code(animation_code, slide_num, topic)
                    
                    update_progress(generation_id, visual_progress, "generating_animation",
                                  f"🎬 Rendering animation for slide {idx}/{total_slides}...")
                    
                    topic_clean_anim = topic[:20].replace(' ', '_').replace(':', '').replace('/', '_')
                    video_path = video_renderer.render_manim_animation(
                        code_path, 
                        f"{topic_clean_anim}_slide_{slide_num}"
                    )
                    animation_paths[slide_num] = video_path
                    
                    base_slide = slide_renderer.create_slide_with_animation_placeholder(
                        slide['title'],
                        slide['content_text'],
                        slide_num,
                        topic
                    )
                    
                    slide_paths[slide_num] = {
                        'type': 'animation_composite',
                        'base_slide': base_slide,
                        'animation': video_path
                    }
                    
                    print(f"✅ Generated ANIMATION for slide {slide_num} (NO IMAGE)")
                    update_progress(generation_id, visual_progress, "generating_animation",
                                  f"✅ Animation created for slide {idx}/{total_slides}")
                    
                except Exception as e:
                    print(f"❌ Error generating animation for slide {slide_num}: {e}")
                    traceback.print_exc()
                    text_slide = slide_renderer.create_text_slide(
                        slide['title'],
                        slide['content_text'],
                        slide_num,
                        topic
                    )
                    slide_paths[slide_num] = text_slide
            
            # PRIORITY 2: Image (if requested and no animation)
            elif has_image and not has_animation:
                update_progress(generation_id, visual_progress, "fetching_image",
                              f"🖼️ Fetching image for slide {idx}/{total_slides}...")
                try:
                    image_keyword = slide.get('image_keyword', '').strip()
                    if not image_keyword:
                        raise ValueError("Image requested but no keyword provided")
                    
                    image_path = image_fetcher.fetch_image(image_keyword, slide_num, topic)
                    if image_path:
                        image_paths[slide_num] = image_path
                        slide_with_img = slide_renderer.create_slide_with_image(
                            slide['title'],
                            slide['content_text'],
                            image_path,
                            slide_num,
                            topic
                        )
                        slide_paths[slide_num] = slide_with_img
                        print(f"✅ Generated IMAGE for slide {slide_num} (NO ANIMATION)")
                        update_progress(generation_id, visual_progress, "fetching_image",
                                      f"✅ Image added to slide {idx}/{total_slides}")
                    else:
                        raise ValueError("Image fetch returned empty path")
                except Exception as e:
                    print(f"❌ Error fetching image for slide {slide_num}: {e}")
                    text_slide = slide_renderer.create_text_slide(
                        slide['title'],
                        slide['content_text'],
                        slide_num,
                        topic
                    )
                    slide_paths[slide_num] = text_slide
            
            # PRIORITY 3: Text-only slide (DEFAULT)
            else:
                update_progress(generation_id, visual_progress, "generating_slide",
                              f"📄 Creating text slide {idx}/{total_slides}...")
                text_slide = slide_renderer.create_text_slide(
                    slide['title'],
                    slide['content_text'],
                    slide_num,
                    topic
                )
                slide_paths[slide_num] = text_slide
                print(f"✅ Generated TEXT-ONLY slide for slide {slide_num}")
                update_progress(generation_id, visual_progress, "generating_slide",
                              f"✅ Text slide {idx}/{total_slides} created")
        
        print(f"\n📊 Final visual breakdown:")
        print(f"   Animations: {len(animation_paths)}")
        print(f"   Images: {len(image_paths)}")
        print(f"   Text-only: {total_slides - len(animation_paths) - len(image_paths)}")
        
        # Step 5: Compose final video
        update_progress(generation_id, 85, "composing_video", "🎞️ Composing final video with audio...")
        
        composer = VideoComposer()
        final_video_path = composer.compose_final_video(
            content_data,
            script_data,
            slide_paths,
            audio_path
        )
        
        update_progress(generation_id, 95, "composing_video", "✅ Video composition complete")
        
        # Extract just the filename for the response
        video_filename = Path(final_video_path).name
        
        # Complete
        update_progress(generation_id, 100, "completed", "✅ Video generation complete!")
        
        print(f"🎬 Backend returning:")
        print(f"   video_path: {final_video_path}")
        print(f"   video_filename: {video_filename}")
        
        return GenerateResponse(
            status="success",
            message="Presentation video generated successfully",
            content_data=content_data,
            script_data=script_data,
            video_path=final_video_path,
            video_filename=video_filename
        )
        
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(f"Full error:\n{traceback.format_exc()}")
        
        update_progress(generation_id, 0, "error", f"❌ {error_msg}")
        
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/api/status/{generation_id}")
async def get_generation_status(generation_id: str):
    """Get status of video generation"""
    
    if generation_id not in generation_status:
        raise HTTPException(status_code=404, detail="Generation ID not found")
    
    return generation_status[generation_id]

@app.get("/api/video/{filename}")
async def get_video(request: Request, filename: str):
    """Stream generated video with range request support"""
    
    # Look for video in final directory
    video_path = Config.FINAL_DIR / filename
    
    if not video_path.exists():
        raise HTTPException(status_code=404, detail=f"Video not found: {filename}")
    
    # Use range request response for proper video streaming
    return range_requests_response(
        request, 
        str(video_path), 
        "video/mp4"
    )

@app.get("/api/content/{generation_id}")
async def get_content(generation_id: str):
    """Get generated content data"""
    
    content_path = Config.SLIDES_DIR / f"{generation_id}_content.json"
    
    if not content_path.exists():
        raise HTTPException(status_code=404, detail="Content not found")
    
    with open(content_path, 'r') as f:
        return json.load(f)

@app.get("/api/script/{generation_id}")
async def get_script(generation_id: str):
    """Get generated script data"""
    
    script_path = Config.SCRIPTS_DIR / f"{generation_id}_script.json"
    
    if not script_path.exists():
        raise HTTPException(status_code=404, detail="Script not found")
    
    with open(script_path, 'r') as f:
        return json.load(f)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
