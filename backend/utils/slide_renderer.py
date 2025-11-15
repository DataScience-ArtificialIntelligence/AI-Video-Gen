

from PIL import Image, ImageDraw, ImageFont
import textwrap
from pathlib import Path
from config import Config
import os


class SlideRenderer:
    """Render PPT-style text slides as images"""
    
    def __init__(self):
        self.width = 1920
        self.height = 1080
        self.bg_color = (255, 255, 255)  # White background
        self.title_color = (0, 51, 102)  # Dark blue
        self.text_color = (51, 51, 51)   # Dark gray
        self.accent_color = (0, 102, 204)  # Blue accent
    
    @staticmethod
    def sanitize_filename(text: str, max_length: int = 30) -> str:
        """Sanitize text for use in filenames"""
        text = text[:max_length]
        text = text.replace(' ', '_').replace(':', '').replace('/', '_').replace('\\', '_')
        text = text.replace('"', '').replace("'", '').replace('?', '').replace('!', '')
        text = text.replace('*', '').replace('<', '').replace('>', '').replace('|', '')
        return text
    
    def get_fonts(self):
        """Get fonts with proper fallback for Windows"""
        try:
            # Try Windows fonts first
            if os.name == 'nt':  # Windows
                title_font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 84)
                content_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 52)
                small_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 40)
            else:  # Linux
                title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 84)
                content_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 52)
                small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
        except Exception as e:
            print(f"⚠️ Could not load system fonts: {e}")
            print("   Using PIL default (text will be smaller)")
            title_font = ImageFont.load_default()
            content_font = ImageFont.load_default()
            small_font = ImageFont.load_default()
        
        return title_font, content_font, small_font
    
    def wrap_text_dynamic(self, text: str, font, max_width: int, draw) -> list:
        """Wrap text dynamically to fit within max_width using actual pixel measurements"""
        words = text.split()
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            # Use textlength for accurate width measurement
            try:
                width = draw.textlength(test_line, font=font)
            except AttributeError:
                # Fallback for older Pillow versions
                bbox = draw.textbbox((0, 0), test_line, font=font)
                width = bbox[2] - bbox[0]
            
            if width <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return lines
        
    def create_text_slide(self, title: str, content: str, slide_number: int, topic: str) -> str:
        """Create a professional text-only slide image with FULL WIDTH text"""
        
        # Create image with gradient background
        img = Image.new('RGB', (self.width, self.height), self.bg_color)
        draw = ImageDraw.Draw(img)
        
        # Load fonts
        title_font, content_font, small_font = self.get_fonts()
        
        # Draw top accent bar
        draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
        # Draw decorative side bar
        draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        
        # Draw title section background
        draw.rectangle([15, 20, self.width, 280], fill=(240, 247, 255))
        
        # Draw title (centered)
        title_y = 90
        title_wrapped = textwrap.fill(title, width=40)  # Wider for full-width slides
        
        bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
        title_width = bbox[2] - bbox[0]
        title_x = (self.width - title_width) // 2
        
        draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
        # Draw separator line
        draw.rectangle([80, 280, self.width - 80, 285], fill=self.accent_color)
        
        # Draw content with FULL WIDTH (no right-side constraint)
        content_y = 380
        content_lines = content.split('\n')
        
        # Use full width for text (with margins)
        text_left_margin = 120
        text_right_margin = 120
        max_text_width = self.width - text_left_margin - text_right_margin
        
        for line in content_lines:
            if line.strip():
                # Remove bullet markers first
                clean_line = line.strip().lstrip('-• ').strip()
                is_bullet = line.strip().startswith(('-', '•'))
                
                # Wrap text dynamically based on actual width
                wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, max_text_width, draw)
                
                for wrapped in wrapped_lines:
                    if is_bullet:
                        draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
                        draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
                        is_bullet = False  # Only first line gets bullet
                    else:
                        draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
                    # Calculate line height
                    bbox = draw.textbbox((0, 0), wrapped, font=content_font)
                    line_height = bbox[3] - bbox[1]
                    content_y += line_height + 30
        
        # Draw footer
        draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
        slide_num_text = f"Slide {slide_number}"
        draw.text((self.width - 280, self.height - 50), slide_num_text, 
                 font=small_font, fill=self.accent_color)
        
        # Save slide
        topic_name = self.sanitize_filename(topic, max_length=30)
        slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
        img.save(slide_path)
        
        return str(slide_path)
    
    def create_slide_with_image(self, title: str, content: str, image_path: str, 
                                slide_number: int, topic: str) -> str:
        """Create a professional slide with text LEFT and image RIGHT"""
        
        # Create image
        img = Image.new('RGB', (self.width, self.height), self.bg_color)
        draw = ImageDraw.Draw(img)
        
        # Load fonts
        title_font, content_font, small_font = self.get_fonts()
        
        # Draw top accent bar
        draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
        # Draw decorative side bar
        draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        
        # Draw title section
        draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
        # Draw title (centered)
        title_y = 80
        title_wrapped = textwrap.fill(title, width=35)
        bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
        title_width = bbox[2] - bbox[0]
        title_x = (self.width - title_width) // 2
        draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
        # Draw separator line
        draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
        # Load and paste image on right side
        try:
            slide_img = Image.open(image_path)
            img_width = 850
            img_height = 700
            slide_img.thumbnail((img_width, img_height), Image.Resampling.LANCZOS)
            
            img_x = self.width - img_width - 60
            img_y = 250
            
            # Draw shadow and border
            shadow_offset = 8
            draw.rectangle(
                [img_x + shadow_offset, img_y + shadow_offset, 
                 img_x + img_width + shadow_offset, img_y + img_height + shadow_offset],
                fill=(200, 200, 200)
            )
            draw.rectangle(
                [img_x - 5, img_y - 5, img_x + img_width + 5, img_y + img_height + 5],
                outline=self.accent_color,
                width=5
            )
            
            img.paste(slide_img, (img_x, img_y))
        except Exception as e:
            print(f"Error loading image: {e}")
        
        # Draw content on LEFT side only
        content_y = 280
        content_lines = content.split('\n')
        
        # Text constrained to left side
        text_left_margin = 100
        text_max_width = 850  # Leave space for right-side image
        
        for line in content_lines:
            if line.strip():
                clean_line = line.strip().lstrip('-• ').strip()
                is_bullet = line.strip().startswith(('-', '•'))
                
                wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
                for wrapped in wrapped_lines:
                    if is_bullet:
                        draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
                        draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
                        is_bullet = False
                    else:
                        draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
                    bbox = draw.textbbox((0, 0), wrapped, font=content_font)
                    line_height = bbox[3] - bbox[1]
                    content_y += line_height + 25
        
        # Draw footer
        draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
        slide_num_text = f"Slide {slide_number}"
        draw.text((100, self.height - 50), slide_num_text, 
                 font=small_font, fill=self.accent_color)
        
        # Save slide
        topic_name = self.sanitize_filename(topic, max_length=30)
        slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
        img.save(slide_path)
        
        return str(slide_path)
    
    def create_slide_with_animation_placeholder(self, title: str, content: str, 
                                                slide_number: int, topic: str) -> str:
        """Create a professional slide with text LEFT and animation placeholder RIGHT"""
        
        # Create image
        img = Image.new('RGB', (self.width, self.height), self.bg_color)
        draw = ImageDraw.Draw(img)
        
        # Load fonts
        title_font, content_font, small_font = self.get_fonts()
        
        # Draw top accent bar
        draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
        # Draw decorative side bar
        draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        
        # Draw title section
        draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
        # Draw title (centered)
        title_y = 80
        title_wrapped = textwrap.fill(title, width=35)
        bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
        title_width = bbox[2] - bbox[0]
        title_x = (self.width - title_width) // 2
        draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
        # Draw separator line
        draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
        # Draw placeholder box on right side for animation
        placeholder_x = self.width - 850 - 60
        placeholder_y = 250
        placeholder_width = 850
        placeholder_height = 700
        
        # Draw shadow
        shadow_offset = 8
        draw.rectangle(
            [placeholder_x + shadow_offset, placeholder_y + shadow_offset,
             placeholder_x + placeholder_width + shadow_offset, 
             placeholder_y + placeholder_height + shadow_offset],
            fill=(200, 200, 200)
        )
        
        # Draw placeholder background with pattern
        draw.rectangle(
            [placeholder_x, placeholder_y, 
             placeholder_x + placeholder_width, placeholder_y + placeholder_height],
            fill=(245, 250, 255),
            outline=self.accent_color,
            width=5
        )
        
        # Draw grid pattern
        grid_spacing = 50
        for i in range(placeholder_x, placeholder_x + placeholder_width, grid_spacing):
            draw.line([(i, placeholder_y), (i, placeholder_y + placeholder_height)], 
                     fill=(230, 240, 250), width=1)
        for i in range(placeholder_y, placeholder_y + placeholder_height, grid_spacing):
            draw.line([(placeholder_x, i), (placeholder_x + placeholder_width, i)], 
                     fill=(230, 240, 250), width=1)
        
        # Draw "Animation" text in center
        placeholder_text = "🎬 Animation"
        bbox = draw.textbbox((0, 0), placeholder_text, font=title_font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = placeholder_x + (placeholder_width - text_width) // 2
        text_y = placeholder_y + (placeholder_height - text_height) // 2
        draw.text((text_x, text_y), placeholder_text, font=title_font, fill=self.accent_color)
        
        # Draw content on LEFT side only
        content_y = 280
        content_lines = content.split('\n')
        
        text_left_margin = 100
        text_max_width = 850
        
        for line in content_lines:
            if line.strip():
                clean_line = line.strip().lstrip('-• ').strip()
                is_bullet = line.strip().startswith(('-', '•'))
                
                wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
                for wrapped in wrapped_lines:
                    if is_bullet:
                        draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
                        draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
                        is_bullet = False
                    else:
                        draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
                    bbox = draw.textbbox((0, 0), wrapped, font=content_font)
                    line_height = bbox[3] - bbox[1]
                    content_y += line_height + 25
        
        # Draw footer
        draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
        slide_num_text = f"Slide {slide_number}"
        draw.text((100, self.height - 50), slide_num_text, 
                 font=small_font, fill=self.accent_color)
        
        # Save slide
        topic_name = self.sanitize_filename(topic, max_length=30)
        slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}_base.png"
        img.save(slide_path)
        
        return str(slide_path)

# slide_renderer.py - Updated version
