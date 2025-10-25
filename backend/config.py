import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API Keys
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
    UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
    
    # Paths
    BASE_DIR = Path(__file__).parent
    OUTPUT_DIR = BASE_DIR / "outputs"
    SCRIPTS_DIR = OUTPUT_DIR / "scripts"
    SLIDES_DIR = OUTPUT_DIR / "slides"
    MANIM_CODE_DIR = OUTPUT_DIR / "manim_code"
    VIDEOS_DIR = OUTPUT_DIR / "videos"
    AUDIO_DIR = OUTPUT_DIR / "audio"
    FINAL_DIR = OUTPUT_DIR / "final"
    IMAGES_DIR = OUTPUT_DIR / "images"
    
    # Create directories
    for dir_path in [SCRIPTS_DIR, SLIDES_DIR, MANIM_CODE_DIR, VIDEOS_DIR, AUDIO_DIR, FINAL_DIR, IMAGES_DIR]:
        dir_path.mkdir(parents=True, exist_ok=True)
    
    # Models
    GEMINI_MODEL = "gemini-2.0-flash-exp"
    
    # Manim settings
    MANIM_QUALITY = "m"  # l=low, m=medium, h=high
    MANIM_FPS = 30
    
    # Sarvam AI TTS Configuration
    SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"
    SARVAM_MODEL = "bulbul:v2"  # Valid models: bulbul:v2 or bulbul:v3-beta
    
    # Language to Sarvam AI speaker mapping (valid speakers from API)
    SARVAM_SPEAKER_MAP = {
        "english": "anushka",  # Indian English female voice
        "hindi": "manisha",    # Hindi female voice
        "kannada": "vidya",    # Kannada female voice
        "telugu": "arya"       # Telugu female voice
    }
