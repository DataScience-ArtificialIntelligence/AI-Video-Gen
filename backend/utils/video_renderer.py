import subprocess
from pathlib import Path
from config import Config
import os

class VideoRenderer:
    """Render Manim animations to video"""
    
    def __init__(self):
        self.quality = Config.MANIM_QUALITY
        self.fps = Config.MANIM_FPS
    
    def render_manim_animation(self, code_path: str, output_name: str = None) -> str:
        """Render a single Manim animation"""
        
        code_path = Path(code_path)
        
        if not code_path.exists():
            raise FileError(f"Manim code file not found: {code_path}")
        
        # Determine output name
        if output_name is None:
            output_name = code_path.stem
        
        # Manim render command
        cmd = [
            "manim",
            "render",
            str(code_path),
            "SlideAnimation",  # Scene class name
            f"-q{self.quality}",
            f"--fps={self.fps}",
            "--format=mp4",
            f"--output_file={output_name}.mp4"
        ]
        
        try:
            # Run manim
            result = subprocess.run(
                cmd,
                cwd=str(code_path.parent),
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode != 0:
                print(f"Manim render error: {result.stderr}")
                raise Exception(f"Manim rendering failed: {result.stderr}")
            
            # Find output video - manim creates folder like "720p30" for quality m
            quality_map = {"l": "480p", "m": "720p", "h": "1080p"}
            quality_res = quality_map.get(self.quality, "720p")
            media_dir = code_path.parent / "media" / "videos" / code_path.stem / f"{quality_res}{self.fps}"
            
            # Try multiple possible filenames
            possible_files = [
                media_dir / f"{output_name}.mp4",
                media_dir / "SlideAnimation.mp4",
                media_dir / f"{code_path.stem}.mp4"
            ]
            
            video_file = None
            for possible_file in possible_files:
                if possible_file.exists():
                    video_file = possible_file
                    break
            
            if not video_file:
                print(f"Searched in: {media_dir}")
                print(f"Available files: {list(media_dir.glob('*.mp4')) if media_dir.exists() else 'directory not found'}")
                raise FileNotFoundError(f"Rendered video not found. Tried: {[str(f) for f in possible_files]}")
            
            # Move to our videos directory
            final_path = Config.VIDEOS_DIR / f"{output_name}.mp4"
            video_file.rename(final_path)
            
            return str(final_path)
            
        except subprocess.TimeoutExpired:
            raise Exception("Manim rendering timed out")
        except Exception as e:
            print(f"Rendering error: {e}")
            raise