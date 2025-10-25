import json
import google.generativeai as genai
from typing import Dict
import re
from config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)

class ManimGenerator:
    """Generate Manim animation code for slides that need dynamic content"""
    
    def __init__(self):
        self.model = genai.GenerativeModel(Config.GEMINI_MODEL)
    
    def generate_animation_code(self, slide_data: Dict, duration: float) -> str:
        """Generate Manim code for a specific slide animation"""
        
        prompt = f"""You are an expert Manim animator. Generate HIGH-QUALITY Manim Community Edition code.

ANIMATION REQUEST:
Title: {slide_data['title']}
Content: {slide_data['content_text']}
**SPECIFIC ANIMATION NEEDED**: {slide_data['animation_description']}
Duration: {duration} seconds

READ THE ANIMATION DESCRIPTION CAREFULLY. Create EXACTLY what is described.

CRITICAL MANIM SYNTAX RULES:
1. **ALL COORDINATES MUST BE 3D**: [x, y, 0] format - NEVER use 2D [x, y]
2. Correct: Polygon([0, -1, 0], [-0.5, 1, 0], [0.5, 1, 0])
3. Wrong: Polygon([0, -1], [-0.5, 1])  ← This will ERROR
4. Circle(radius=1, color=BLUE, fill_opacity=0.3)
5. Text("label", font_size=24)  # Use font_size, not size
6. MathTex(r"a^2 + b^2 = c^2")  # Use raw strings r"..." for math
7. Arrow(start=[x1, y1, 0], end=[x2, y2, 0], color=RED)
8. Colors: BLUE, RED, GREEN, YELLOW, WHITE, ORANGE, PURPLE, PINK (uppercase only)
9. self.play(Create(obj)) for creating, self.play(Transform(a, b)) for transforming
10. self.wait(seconds) for pauses

QUALITY REQUIREMENTS:
1. Class name MUST be 'SlideAnimation'
2. Follow the animation_description precisely
3. Use clear labels with Text() or MathTex()
4. Add colors to distinguish elements (e.g., different colors for different parts)
5. Animate step-by-step with self.play() - don't just show static images
6. Use appropriate wait() calls to let viewer see each step
7. Total duration should be approximately {duration} seconds
8. Make it educational - viewer should learn from watching
9. Test each coordinate - ensure it's 3D [x, y, 0]

EXAMPLE - Pythagorean Theorem Animation:
```python
from manim import *

class SlideAnimation(Scene):
    def construct(self):
        # Create right triangle
        triangle = Polygon(
            [0, 0, 0],      # Origin (3D!)
            [3, 0, 0],      # Base (3D!)
            [3, 2, 0],      # Height (3D!)
            color=WHITE
        )
        self.play(Create(triangle))
        self.wait(0.5)
        
        # Create squares on each side
        square_a = Square(side_length=2, color=BLUE, fill_opacity=0.3).move_to([3.5, 1, 0])
        square_b = Square(side_length=3, color=RED, fill_opacity=0.3).move_to([1.5, -1, 0])
        
        self.play(Create(square_a), Create(square_b))
        self.wait(1)
        
        # Labels
        label_a = MathTex("a^2").move_to([3.5, 1, 0])
        label_b = MathTex("b^2").move_to([1.5, -1, 0])
        self.play(Write(label_a), Write(label_b))
        
        self.wait({duration} - 3)  # Adjust remaining time
```

Now generate YOUR animation based on the animation_description above.
Generate ONLY executable Python code. No markdown, no explanations."""
        
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
        filename = f"{topic[:20].replace(' ', '_')}_slide_{slide_number}.py"
        file_path = Config.MANIM_CODE_DIR / filename
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(code)
        
        return str(file_path)
