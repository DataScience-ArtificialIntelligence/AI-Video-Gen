
# import subprocess
# from pathlib import Path
# from config import Config
# from moviepy import VideoFileClip, ImageClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip
# from typing import List, Dict
# import os


# class VideoComposer:
#     """Compose final video from slides, animations, images, and audio"""
    
#     def __init__(self):
#         pass
    
#     @staticmethod
#     def sanitize_filename(text: str, max_length: int = 30) -> str:
#         """Sanitize text for use in filenames"""
#         text = text[:max_length]
#         text = text.replace(' ', '_').replace(':', '').replace('/', '_').replace('\\', '_')
#         text = text.replace('"', '').replace("'", '').replace('?', '').replace('!', '')
#         text = text.replace('*', '').replace('<', '').replace('>', '').replace('|', '')
#         return text
    
#     def create_slide_video(self, slide_path: str, duration: float) -> VideoFileClip:
#         """Create video clip for a single slide"""
        
#         if not slide_path or not Path(slide_path).exists():
#             from moviepy import ColorClip
#             print(f"⚠️ Slide path not found, creating blank slide")
#             return ColorClip(size=(1920, 1080), color=(20, 20, 40), duration=duration)
        
#         if slide_path.endswith(('.mp4', '.mov', '.avi')):
#             video_clip = VideoFileClip(slide_path)
#             if video_clip.duration < duration:
#                 video_clip = video_clip.with_duration(duration)
#             elif video_clip.duration > duration:
#                 video_clip = video_clip.subclipped(0, duration)
#             return video_clip
#         else:
#             return ImageClip(slide_path, duration=duration)
    
#     def compose_final_video(self, content_data: Dict, script_data: Dict,
#                            slide_paths: Dict[int, str],
#                            audio_path: str) -> str:
#         """Compose final video from all slides with synchronized audio"""
        
#         slide_clips = []
        
#         print(f"\n🎬 Starting video composition...")
#         print(f"   Total slides: {len(content_data['slides'])}")
        
#         for i, slide in enumerate(content_data['slides']):
#             slide_num = slide['slide_number']
            
#             slide_script = next(
#                 (s for s in script_data['slide_scripts'] if s['slide_number'] == slide_num),
#                 None
#             )
            
#             if not slide_script:
#                 print(f"⚠️ Warning: No script found for slide {slide_num}")
#                 continue
            
#             duration = slide_script['end_time'] - slide_script['start_time']
#             print(f"   Processing slide {slide_num}: {duration:.1f}s")
            
#             slide_data = slide_paths.get(slide_num)
            
#             if not slide_data:
#                 print(f"⚠️ Warning: No slide visual found for slide {slide_num}")
#                 continue
            
#             if isinstance(slide_data, dict) and slide_data.get('type') == 'animation_composite':
#                 print(f"   🎬 Compositing animation for slide {slide_num}...")
#                 slide_clip = self.composite_animation_on_slide(
#                     slide_data['base_slide'],
#                     slide_data['animation'],
#                     duration
#                 )
#             else:
#                 slide_clip = self.create_slide_video(slide_data, duration)
            
#             slide_clips.append(slide_clip)
        
#         if not slide_clips:
#             raise ValueError("No slide clips were created")
        
#         print(f"\n🔗 Concatenating {len(slide_clips)} slide clips...")
#         final_video = concatenate_videoclips(slide_clips, method="compose")
#         print(f"   Total video duration: {final_video.duration:.1f}s")
        
#         if audio_path and Path(audio_path).exists():
#             print(f"🎵 Adding audio track...")
#             audio = AudioFileClip(audio_path)
#             print(f"   Audio duration: {audio.duration:.1f}s")
            
#             if abs(final_video.duration - audio.duration) > 0.5:
#                 print(f"⚠️ Warning: Video duration ({final_video.duration:.1f}s) doesn't match audio ({audio.duration:.1f}s)")
            
#             final_video = final_video.with_audio(audio)
        
#         topic_name = self.sanitize_filename(content_data['topic'], max_length=30)
#         output_path = Config.FINAL_DIR / f"{topic_name}_final.mp4"
        
#         print(f"\n📹 Writing final video to: {output_path}")
#         print(f"   Resolution: 1920x1080")
#         print(f"   FPS: {Config.MANIM_FPS}")
#         print(f"   Codec: libx264 + aac")
        
#         final_video.write_videofile(
#             str(output_path),
#             fps=Config.MANIM_FPS,
#             codec='libx264',
#             audio_codec='aac',
#             preset='medium',
#             bitrate='5000k',
#             audio_bitrate='192k'
#         )
        
#         print(f"🧹 Cleaning up video clips...")
#         for clip in slide_clips:
#             clip.close()
#         final_video.close()
#         if audio_path and Path(audio_path).exists():
#             audio.close()
        
#         print(f"✅ Final video saved: {output_path}")
#         return str(output_path)
    
#     def composite_animation_on_slide(self, slide_image_path: str, animation_video_path: str, 
#                                      duration: float) -> VideoFileClip:
#         """Composite animation video onto a slide image in the placeholder area"""
        
#         print(f"      🎬 Compositing animation onto slide...")
#         print(f"         Slide: {Path(slide_image_path).name}")
#         print(f"         Animation: {Path(animation_video_path).name}")
#         print(f"         Duration: {duration:.1f}s")
        
#         # Load base slide image
#         slide_clip = ImageClip(slide_image_path, duration=duration)
        
#         # Load animation video
#         animation_clip = VideoFileClip(animation_video_path)
#         original_duration = animation_clip.duration
#         print(f"         Original animation duration: {original_duration:.1f}s")
        
#         # STEP 1: Handle duration adjustment first (WITHOUT position or resize)
#         if original_duration < duration:
#             print(f"         ⟳ Looping animation to match slide duration")
#             # Calculate how many loops needed
#             num_loops = int(duration / original_duration) + 1
            
#             # Create list of clips to loop
#             looped_clips = [animation_clip] * num_loops
            
#             # Concatenate and trim to exact duration
#             animation_adjusted = concatenate_videoclips(looped_clips, method="compose")
#             animation_adjusted = animation_adjusted.subclipped(0, duration)
            
#         elif original_duration > duration:
#             print(f"         ✂️ Trimming animation to match slide duration")
#             animation_adjusted = animation_clip.subclipped(0, duration)
            
#         else:
#             print(f"         ✅ Animation duration matches slide duration")
#             animation_adjusted = animation_clip.with_duration(duration)
        
#         # STEP 2: Now apply resize and position as the FINAL operations
#         # This prevents position loss from duration operations
#         animation_final = animation_adjusted.resized(new_size=(850, 700))
#         animation_final = animation_final.with_position((1010, 250))
        
#         print(f"         ✅ Animation positioned at (1010, 250) with size 850x700")
#         print(f"         Final animation duration: {animation_final.duration:.1f}s")
        
#         # STEP 3: Composite animation on top of slide
#         composite = CompositeVideoClip(
#             [slide_clip, animation_final],
#             size=(1920, 1080)
#         )
        
#         return composite

# above code is previous code

import subprocess
from pathlib import Path
from config import Config
from moviepy import (
    VideoFileClip, 
    ImageClip, 
    AudioFileClip, 
    concatenate_videoclips, 
    CompositeVideoClip,
    ColorClip  # Added to main imports
)
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
        text = text.replace(' ', '_').replace(':', '').replace('/', '_').replace('\\', '_')
        text = text.replace('"', '').replace("'", '').replace('?', '').replace('!', '')
        text = text.replace('*', '').replace('<', '').replace('>', '').replace('|', '')
        return text
    
    def create_slide_video(self, slide_path: str, duration: float) -> VideoFileClip:
        """Create video clip for a single slide"""
        
        if not slide_path or not Path(slide_path).exists():
            print(f"⚠️ Slide path not found, creating blank slide")
            return ColorClip(size=(1920, 1080), color=(20, 20, 40), duration=duration)
        
        if slide_path.endswith(('.mp4', '.mov', '.avi')):
            video_clip = VideoFileClip(slide_path)
            if video_clip.duration < duration:
                video_clip = video_clip.with_duration(duration)
            elif video_clip.duration > duration:
                video_clip = video_clip.subclipped(0, duration)
            return video_clip
        else:
            return ImageClip(slide_path, duration=duration)
    
    def compose_final_video(self, content_data: Dict, script_data: Dict,
                           slide_paths: Dict[int, str],
                           audio_path: str) -> str:
        """Compose final video from all slides with synchronized audio"""
        
        slide_clips = []
        
        print(f"\n🎬 Starting video composition...")
        print(f"   Total slides: {len(content_data['slides'])}")
        
        for i, slide in enumerate(content_data['slides']):
            slide_num = slide['slide_number']
            
            slide_script = next(
                (s for s in script_data['slide_scripts'] if s['slide_number'] == slide_num),
                None
            )
            
            if not slide_script:
                print(f"⚠️ Warning: No script found for slide {slide_num}")
                continue
            
            duration = slide_script['end_time'] - slide_script['start_time']
            print(f"   Processing slide {slide_num}: {duration:.1f}s")
            
            slide_data = slide_paths.get(slide_num)
            
            if not slide_data:
                print(f"⚠️ Warning: No slide visual found for slide {slide_num}")
                continue
            
            if isinstance(slide_data, dict) and slide_data.get('type') == 'animation_composite':
                print(f"   🎬 Compositing animation for slide {slide_num}...")
                slide_clip = self.composite_animation_on_slide(
                    slide_data['base_slide'],
                    slide_data['animation'],
                    duration
                )
            else:
                slide_clip = self.create_slide_video(slide_data, duration)
            
            slide_clips.append(slide_clip)
        
        if not slide_clips:
            raise ValueError("No slide clips were created")
        
        print(f"\n🔗 Concatenating {len(slide_clips)} slide clips...")
        final_video = concatenate_videoclips(slide_clips, method="compose")
        print(f"   Total video duration: {final_video.duration:.1f}s")
        
        if audio_path and Path(audio_path).exists():
            print(f"🎵 Adding audio track...")
            audio = AudioFileClip(audio_path)
            print(f"   Audio duration: {audio.duration:.1f}s")
            
            if abs(final_video.duration - audio.duration) > 0.5:
                print(f"⚠️ Warning: Video duration ({final_video.duration:.1f}s) doesn't match audio ({audio.duration:.1f}s)")
            
            final_video = final_video.with_audio(audio)
        
        topic_name = self.sanitize_filename(content_data['topic'], max_length=30)
        output_path = Config.FINAL_DIR / f"{topic_name}_final.mp4"
        
        print(f"\n📹 Writing final video to: {output_path}")
        print(f"   Resolution: 1920x1080")
        print(f"   FPS: {Config.MANIM_FPS}")
        print(f"   Codec: libx264 + aac")
        
        final_video.write_videofile(
            str(output_path),
            fps=Config.MANIM_FPS,
            codec='libx264',
            audio_codec='aac',
            preset='medium',
            bitrate='5000k',
            audio_bitrate='192k'
        )
        
        print(f"🧹 Cleaning up video clips...")
        for clip in slide_clips:
            clip.close()
        final_video.close()
        if audio_path and Path(audio_path).exists():
            audio.close()
        
        print(f"✅ Final video saved: {output_path}")
        return str(output_path)
    
    def composite_animation_on_slide(self, slide_image_path: str, animation_video_path: str, 
                                     duration: float) -> VideoFileClip:
        """Composite animation video onto a slide image in the placeholder area"""
        
        print(f"      🎬 Compositing animation onto slide...")
        print(f"         Slide: {Path(slide_image_path).name}")
        print(f"         Animation: {Path(animation_video_path).name}")
        print(f"         Duration: {duration:.1f}s")
        
        # Load base slide image
        slide_clip = ImageClip(slide_image_path, duration=duration)
        
        # Load animation video
        animation_clip = VideoFileClip(animation_video_path)
        original_duration = animation_clip.duration
        print(f"         Original animation duration: {original_duration:.1f}s")
        
        # STEP 1: Handle duration adjustment first (WITHOUT position or resize)
        if original_duration < duration:
            print(f"         ⟳ Looping animation to match slide duration")
            # Calculate how many loops needed
            num_loops = int(duration / original_duration) + 1
            
            # Create list of clips to loop
            looped_clips = [animation_clip] * num_loops
            
            # Concatenate and trim to exact duration
            animation_adjusted = concatenate_videoclips(looped_clips, method="compose")
            animation_adjusted = animation_adjusted.subclipped(0, duration)
            
        elif original_duration > duration:
            print(f"         ✂️ Trimming animation to match slide duration")
            animation_adjusted = animation_clip.subclipped(0, duration)
            
        else:
            print(f"         ✅ Animation duration matches slide duration")
            animation_adjusted = animation_clip.with_duration(duration)
        
        # STEP 2: Now apply resize and position as the FINAL operations
        animation_final = animation_adjusted.resized(new_size=(850, 700))
        animation_final = animation_final.with_position((1010, 250))
        
        print(f"         ✅ Animation positioned at (1010, 250) with size 850x700")
        print(f"         Final animation duration: {animation_final.duration:.1f}s")
        
        # STEP 3: Composite animation on top of slide
        composite = CompositeVideoClip(
            [slide_clip, animation_final],
            size=(1920, 1080)
        )
        
        return composite
