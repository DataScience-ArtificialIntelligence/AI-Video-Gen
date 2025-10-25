import subprocess
from pathlib import Path
from config import Config
from moviepy.editor import VideoFileClip, ImageClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip
from typing import List, Dict
import os

class VideoComposer:
    """Compose final video from slides, animations, images, and audio"""
    
    def __init__(self):
        pass
    
    def create_slide_video(self, slide_path: str, duration: float) -> VideoFileClip:
        """Create video clip for a single slide (can be image, video, or text slide)"""
        
        if not slide_path or not Path(slide_path).exists():
            # Fallback: create blank slide
            from moviepy.editor import ColorClip
            return ColorClip(size=(1920, 1080), color=(20, 20, 40), duration=duration)
        
        # Check if it's a video file (manim animation)
        if slide_path.endswith(('.mp4', '.mov', '.avi')):
            video_clip = VideoFileClip(slide_path)
            # Adjust duration if needed
            if video_clip.duration < duration:
                # Extend to match duration by freezing last frame
                video_clip = video_clip.fx(lambda clip: clip.set_duration(duration))
            elif video_clip.duration > duration:
                # Trim to match duration
                video_clip = video_clip.subclip(0, duration)
            return video_clip
        
        # Otherwise it's an image file (text slide or slide with image)
        else:
            return ImageClip(slide_path, duration=duration)
    
    def compose_final_video(self, content_data: Dict, script_data: Dict,
                           slide_paths: Dict[int, str],
                           audio_path: str) -> str:
        """Compose final video from all slides with synchronized audio"""
        
        slide_clips = []
        
        # Create video clip for each slide
        for i, slide in enumerate(content_data['slides']):
            slide_num = slide['slide_number']
            
            # Get script for this slide to get duration
            slide_script = next(
                (s for s in script_data['slide_scripts'] if s['slide_number'] == slide_num),
                None
            )
            
            if not slide_script:
                print(f"Warning: No script found for slide {slide_num}")
                continue
            
            duration = slide_script['end_time'] - slide_script['start_time']
            
            # Get slide path (can be text slide, image slide, or animation video)
            slide_path = slide_paths.get(slide_num)
            
            if not slide_path:
                print(f"Warning: No slide visual found for slide {slide_num}")
                continue
            
            # Create slide video clip
            slide_clip = self.create_slide_video(slide_path, duration)
            slide_clips.append(slide_clip)
        
        # Concatenate all slide clips
        if not slide_clips:
            raise ValueError("No slide clips were created")
        
        final_video = concatenate_videoclips(slide_clips, method="compose")
        
        # Add audio
        if audio_path and Path(audio_path).exists():
            audio = AudioFileClip(audio_path)
            # Adjust video duration to match audio if needed
            if abs(final_video.duration - audio.duration) > 0.5:
                print(f"Warning: Video duration ({final_video.duration}s) doesn't match audio ({audio.duration}s)")
            final_video = final_video.set_audio(audio)
        
        # Save final video
        topic_name = content_data['topic'][:30].replace(' ', '_')
        output_path = Config.FINAL_DIR / f"{topic_name}_final.mp4"
        
        final_video.write_videofile(
            str(output_path),
            fps=Config.MANIM_FPS,
            codec='libx264',
            audio_codec='aac'
        )
        
        # Clean up
        for clip in slide_clips:
            clip.close()
        final_video.close()
        if audio_path:
            audio.close()
        
        return str(output_path)
