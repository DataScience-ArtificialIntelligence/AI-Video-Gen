from PIL import Image, ImageDraw, ImageFont
import textwrap
from pathlib import Path
from config import Config

class SlideRenderer:
    """Render PPT-style text slides as images"""
    
    def __init__(self):
        self.width = 1920
        self.height = 1080
        self.bg_color = (255, 255, 255)  # White background
        self.title_color = (0, 51, 102)  # Dark blue
        self.text_color = (51, 51, 51)   # Dark gray
        self.accent_color = (0, 102, 204)  # Blue accent
        
    def create_text_slide(self, title: str, content: str, slide_number: int, topic: str) -> str:
        """Create a text-only slide image"""
        
        # Create image
        img = Image.new('RGB', (self.width, self.height), self.bg_color)
        draw = ImageDraw.Draw(img)
        
        # Try to load fonts, fallback to default
        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
            content_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
        except:
            try:
                title_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", 80)
                content_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", 48)
            except:
                # Fallback to default font with larger size
                title_font = ImageFont.load_default()
                content_font = ImageFont.load_default()
        
        # Draw accent bar at top
        draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
        # Draw title
        title_y = 150
        # Wrap title if too long
        title_wrapped = textwrap.fill(title, width=30)
        draw.text((100, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
        # Draw content
        content_y = 400
        content_wrapped = textwrap.fill(content, width=50)
        draw.text((100, content_y), content_wrapped, font=content_font, fill=self.text_color)
        
        # Draw slide number
        slide_num_text = f"Slide {slide_number}"
        draw.text((self.width - 200, self.height - 80), slide_num_text, 
                 font=content_font, fill=self.accent_color)
        
        # Save slide
        topic_name = topic[:30].replace(' ', '_')
        slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
        img.save(slide_path)
        
        return str(slide_path)
    
    def create_slide_with_image(self, title: str, content: str, image_path: str, 
                                slide_number: int, topic: str) -> str:
        """Create a slide with text and image side by side"""
        
        # Create image
        img = Image.new('RGB', (self.width, self.height), self.bg_color)
        draw = ImageDraw.Draw(img)
        
        # Try to load fonts
        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 70)
            content_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
        except:
            try:
                title_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", 70)
                content_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", 40)
            except:
                title_font = ImageFont.load_default()
                content_font = ImageFont.load_default()
        
        # Draw accent bar
        draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
        # Draw title at top
        title_y = 80
        title_wrapped = textwrap.fill(title, width=35)
        draw.text((100, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
        # Load and paste image on right side
        try:
            slide_img = Image.open(image_path)
            # Resize image to fit right half
            img_width = 800
            img_height = 600
            slide_img.thumbnail((img_width, img_height), Image.Resampling.LANCZOS)
            
            # Calculate position (right side)
            img_x = self.width - img_width - 100
            img_y = 300
            img.paste(slide_img, (img_x, img_y))
        except Exception as e:
            print(f"Error loading image: {e}")
        
        # Draw content on left side
        content_y = 350
        content_wrapped = textwrap.fill(content, width=35)
        draw.text((100, content_y), content_wrapped, font=content_font, fill=self.text_color)
        
        # Draw slide number
        slide_num_text = f"Slide {slide_number}"
        draw.text((100, self.height - 80), slide_num_text, 
                 font=content_font, fill=self.accent_color)
        
        # Save slide
        topic_name = topic[:30].replace(' ', '_')
        slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
        img.save(slide_path)
        
        return str(slide_path)
