import json
import google.generativeai as genai
from typing import Dict
import re
from pathlib import Path
from config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)

class ManimGenerator:
    """Generate Manim animation code for slides that need dynamic content"""
    
    def __init__(self):
        self.model = genai.GenerativeModel(Config.GEMINI_MODEL)
    
    @staticmethod
    def sanitize_filename(text: str, max_length: int = 20) -> str:
        """Sanitize text for use in filenames"""
        text = text[:max_length]
        # Remove or replace problematic characters
        text = text.replace(' ', '_').replace(':', '').replace('/', '_').replace('\\', '_')
        text = text.replace('"', '').replace("'", '').replace('?', '').replace('!', '')
        text = text.replace('*', '').replace('<', '').replace('>', '').replace('|', '')
        return text
    
    def generate_animation_code(self, slide_data: Dict, duration: float) -> str:
        """Generate Manim code for a specific slide animation"""
        
        # Read the code guidelines
        guide_path = Path(__file__).parent.parent / "MANIM_CODE_GUIDE.md"
        try:
            with open(guide_path, 'r', encoding='utf-8') as f:
                guidelines = f.read()
        except:
            guidelines = "Follow standard Manim Community Edition syntax."
        
        prompt = f"""Generate Manim animation code. Follow ALL rules to avoid errors.

TASK:
- Title: {slide_data['title']}
- Animation: {slide_data['animation_description']}
- Duration: {duration}s

⚠️ CRITICAL: Read "USE ONLY THESE SAFE OBJECTS" section carefully.
Do NOT use any object not listed there (like CurvedPolyline, NumberLine, Axes, etc.)

RULES:
{guidelines}

OUTPUT: Only Python code. Class name = 'SlideAnimation'. No markdown, no explanations.
"""
        
        try:
            response = self.model.generate_content(prompt)
            code = response.text.strip()
            
            # Extract code from markdown blocks
            match = re.search(r"```(?:python\n)?(.*?)```", code, re.DOTALL)
            if match:
                code = match.group(1).strip()
            
            # Basic validation
            required_elements = [
                "from manim import",
                "class SlideAnimation",
                "def construct(self):",
            ]
            
            for element in required_elements:
                if element not in code:
                    raise ValueError(f"Generated code missing: {element}")
            
            return code
            
        except Exception as e:
            print(f"Error generating animation code: {e}")
            # Return fallback simple animation
            return self._get_fallback_animation(slide_data, duration)
    
    def _get_fallback_animation(self, slide_data: Dict, duration: float) -> str:
        """Generate a simple fallback animation"""
        return f"""from manim import *

class SlideAnimation(Scene):
    def construct(self):
        # Simple fallback animation
        text = Text("{slide_data['title']}", font_size=40, color=BLUE)
        self.play(Write(text))
        self.wait({duration - 1})
        self.play(FadeOut(text))
"""
    
    def save_animation_code(self, code: str, slide_number: int, topic: str) -> str:
        """Save animation code to file"""
        topic_name = self.sanitize_filename(topic, max_length=20)
        filename = f"{topic_name}_slide_{slide_number}.py"
        file_path = Config.MANIM_CODE_DIR / filename
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(code)
        
        return str(file_path)
