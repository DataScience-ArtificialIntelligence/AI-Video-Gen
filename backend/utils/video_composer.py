import subprocess
from pathlib import Path
from config import Config
from moviepy import VideoFileClip, ImageClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip
from typing import List, Dict
import os

class VideoComposer:
    """Compose final video from slides, animations, images, and audio"""
    
    def __init__(self):
        pass
    
    @staticmethod
    def sanitize_filename(text: str, max_length: int = 30) -> str:
        """Sanitize text for use in filenames"""
        text = text[:max_length]
        # Remove or replace problematic characters
        text = text.replace(' ', '_').replace(':', '').replace('/', '_').replace('\\', '_')
        text = text.replace('"', '').replace("'", '').replace('?', '').replace('!', '')
        text = text.replace('*', '').replace('<', '').replace('>', '').replace('|', '')
        return text
    
    def create_slide_video(self, slide_path: str, duration: float) -> VideoFileClip:
        """Create video clip for a single slide (can be image, video, or text slide)"""
        
        if not slide_path or not Path(slide_path).exists():
            # Fallback: create blank slide
            from moviepy import ColorClip
            return ColorClip(size=(1920, 1080), color=(20, 20, 40), duration=duration)
        
        # Check if it's a video file (manim animation)
        if slide_path.endswith(('.mp4', '.mov', '.avi')):
            video_clip = VideoFileClip(slide_path)
            # Adjust duration if needed
            if video_clip.duration < duration:
                # Extend to match duration by freezing last frame
                video_clip = video_clip.with_duration(duration)
            elif video_clip.duration > duration:
                # Trim to match duration
                video_clip = video_clip.subclipped(0, duration)
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
            
            # Get slide path (can be text slide, image slide, animation composite, or animation video)
            slide_data = slide_paths.get(slide_num)
            
            if not slide_data:
                print(f"Warning: No slide visual found for slide {slide_num}")
                continue
            
            # Check if it's an animation composite (dict with base_slide and animation)
            if isinstance(slide_data, dict) and slide_data.get('type') == 'animation_composite':
                # Composite animation onto slide
                print(f"Compositing animation for slide {slide_num}...")
                slide_clip = self.composite_animation_on_slide(
                    slide_data['base_slide'],
                    slide_data['animation'],
                    duration
                )
            else:
                # Regular slide (string path to image or video)
                slide_clip = self.create_slide_video(slide_data, duration)
            
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
            final_video = final_video.with_audio(audio)
        
        # Save final video
        # Sanitize topic name - remove special characters that can cause filename issues
        topic_name = self.sanitize_filename(content_data['topic'], max_length=30)
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
    
    def composite_animation_on_slide(self, slide_image_path: str, animation_video_path: str, 
                                     duration: float) -> VideoFileClip:
        """Composite animation video onto a slide image in the placeholder area"""
        
        # Load base slide image
        slide_clip = ImageClip(slide_image_path, duration=duration)
        
        # Load animation video
        animation_clip = VideoFileClip(animation_video_path)
        
        # Resize animation to fit in placeholder box (800x600 on right side)
        # MoviePy 2.x: resized(new_size=(width, height))
        animation_resized = animation_clip.resized(new_size=(800, 600))
        
        # Position animation in placeholder area (right side of slide)
        # Placeholder position: x = 1920 - 800 - 100 = 1020, y = 300
        animation_positioned = animation_resized.with_position((1020, 300))
        
        # Adjust animation duration to match slide
        if animation_resized.duration < duration:
            # Loop animation if shorter than slide (manual loop by concatenating)
            from moviepy import concatenate_videoclips
            num_loops = int(duration / animation_positioned.duration) + 1
            looped_clips = [animation_positioned] * num_loops
            animation_positioned = concatenate_videoclips(looped_clips).subclipped(0, duration)
        elif animation_resized.duration > duration:
            # Trim if longer
            animation_positioned = animation_positioned.subclipped(0, duration)
        else:
            animation_positioned = animation_positioned.with_duration(duration)
        
        # Composite animation on top of slide
        composite = CompositeVideoClip([slide_clip, animation_positioned])
        
        return composite
