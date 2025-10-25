from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import traceback
import json
from pathlib import Path

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

# Store generation status
generation_status = {}

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
        generation_status[generation_id] = {
            "status": "started",
            "progress": 0,
            "message": "Starting generation..."
        }
        
        # Step 1: Generate PPT content structure
        generation_status[generation_id] = {
            "status": "generating_content",
            "progress": 10,
            "message": "Generating presentation content..."
        }
        
        content_gen = ContentGenerator()
        content_data = content_gen.generate_content(topic, request.num_slides)
        
        # Step 2: Generate narration scripts with timestamps
        generation_status[generation_id] = {
            "status": "generating_scripts",
            "progress": 25,
            "message": "Generating voice scripts..."
        }
        
        script_gen = ScriptGenerator()
        script_data = script_gen.generate_scripts(content_data, request.language, request.tone)
        
        # Step 3: Generate voice audio PER SLIDE and get actual durations
        generation_status[generation_id] = {
            "status": "generating_audio",
            "progress": 40,
            "message": "Generating voice narration per slide..."
        }
        
        voice_gen = VoiceGenerator()
        slide_audio_paths = {}
        actual_durations = {}
        
        # Generate audio for each slide separately
        for slide_script in script_data['slide_scripts']:
            slide_num = slide_script['slide_number']
            try:
                audio_path = voice_gen.generate_voice_for_slide(
                    slide_script['narration_text'],
                    slide_num,
                    topic,
                    request.language
                )
                slide_audio_paths[slide_num] = audio_path
                
                # Get actual audio duration
                from moviepy import AudioFileClip
                audio_clip = AudioFileClip(audio_path)
                actual_durations[slide_num] = audio_clip.duration
                audio_clip.close()
                
                print(f"Slide {slide_num}: Estimated {slide_script['end_time'] - slide_script['start_time']:.1f}s, Actual {actual_durations[slide_num]:.1f}s")
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
        audio_path = voice_gen.combine_slide_audios(slide_audio_paths, topic)
        
        # Step 4: Generate slide visuals (text slides, animations, or images)
        generation_status[generation_id] = {
            "status": "generating_media",
            "progress": 55,
            "message": "Generating slide visuals..."
        }
        
        manim_gen = ManimGenerator()
        image_fetcher = ImageFetcher()
        video_renderer = VideoRenderer()
        slide_renderer = SlideRenderer()
        
        slide_paths = {}  # Stores all slide visual paths
        animation_paths = {}
        image_paths = {}
        
        for slide in content_data['slides']:
            slide_num = slide['slide_number']
            
            # Priority 1: Animation (5-10 seconds dynamic content)
            if slide.get('needs_animation'):
                try:
                    # Get slide duration from script (voice narration duration)
                    slide_script = next(
                        (s for s in script_data['slide_scripts'] if s['slide_number'] == slide_num),
                        None
                    )
                    # Use the full narration duration for the animation
                    duration = slide_script['end_time'] - slide_script['start_time'] if slide_script else slide['duration']
                    
                    # Generate animation code that matches the narration duration
                    animation_code = manim_gen.generate_animation_code(slide, duration)
                    code_path = manim_gen.save_animation_code(animation_code, slide_num, topic)
                    
                    # Render animation at FULL RESOLUTION first (no constraints)
                    # Sanitize topic for filename
                    topic_clean = topic[:20].replace(' ', '_').replace(':', '').replace('/', '_')
                    video_path = video_renderer.render_manim_animation(
                        code_path, 
                        f"{topic_clean}_slide_{slide_num}"
                    )
                    animation_paths[slide_num] = video_path
                    
                    # Create base slide with animation placeholder
                    base_slide = slide_renderer.create_slide_with_animation_placeholder(
                        slide['title'],
                        slide['content_text'],
                        slide_num,
                        topic
                    )
                    
                    # Store both for later compositing
                    slide_paths[slide_num] = {
                        'type': 'animation_composite',
                        'base_slide': base_slide,
                        'animation': video_path
                    }
                    print(f"Generated animation for slide {slide_num} (duration: {duration}s) - will composite into slide")
                    
                except Exception as e:
                    print(f"Error generating animation for slide {slide_num}: {e}")
                    traceback.print_exc()
                    # Fallback to text slide
                    text_slide = slide_renderer.create_text_slide(
                        slide['title'],
                        slide['content_text'],
                        slide_num,
                        topic
                    )
                    slide_paths[slide_num] = text_slide
            
            # Priority 2: Image (static visual support)
            elif slide.get('needs_image') and slide.get('image_keyword'):
                try:
                    image_path = image_fetcher.fetch_image(slide['image_keyword'], slide_num, topic)
                    if image_path:
                        image_paths[slide_num] = image_path
                        # Create slide with image
                        slide_with_img = slide_renderer.create_slide_with_image(
                            slide['title'],
                            slide['content_text'],
                            image_path,
                            slide_num,
                            topic
                        )
                        slide_paths[slide_num] = slide_with_img
                        print(f"Generated slide with image for slide {slide_num}")
                except Exception as e:
                    print(f"Error fetching image for slide {slide_num}: {e}")
                    # Fallback to text slide
                    text_slide = slide_renderer.create_text_slide(
                        slide['title'],
                        slide['content_text'],
                        slide_num,
                        topic
                    )
                    slide_paths[slide_num] = text_slide
            
            # Priority 3: Text-only slide (most common)
            else:
                text_slide = slide_renderer.create_text_slide(
                    slide['title'],
                    slide['content_text'],
                    slide_num,
                    topic
                )
                slide_paths[slide_num] = text_slide
                print(f"Generated text slide for slide {slide_num}")
        
        # Step 5: Compose final video
        generation_status[generation_id] = {
            "status": "composing_video",
            "progress": 85,
            "message": "Composing final video..."
        }
        
        composer = VideoComposer()
        final_video_path = composer.compose_final_video(
            content_data,
            script_data,
            slide_paths,
            audio_path
        )
        
        # Complete
        generation_status[generation_id] = {
            "status": "completed",
            "progress": 100,
            "message": "Video generation complete!",
            "video_path": final_video_path
        }
        
        return GenerateResponse(
            status="success",
            message="Presentation video generated successfully",
            content_data=content_data,
            script_data=script_data,
            video_path=final_video_path
        )
        
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(f"Full error:\n{traceback.format_exc()}")
        
        if generation_id in generation_status:
            generation_status[generation_id] = {
                "status": "error",
                "progress": 0,
                "message": error_msg
            }
        
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/api/status/{generation_id}")
async def get_generation_status(generation_id: str):
    """Get status of video generation"""
    
    if generation_id not in generation_status:
        raise HTTPException(status_code=404, detail="Generation ID not found")
    
    return generation_status[generation_id]

@app.get("/api/video/{filename}")
async def get_video(filename: str):
    """Download generated video"""
    
    video_path = Config.FINAL_DIR / filename
    
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Video not found")
    
    return FileResponse(
        video_path,
        media_type="video/mp4",
        filename=filename
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
