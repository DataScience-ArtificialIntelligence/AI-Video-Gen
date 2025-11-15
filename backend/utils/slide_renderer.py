

# # # from PIL import Image, ImageDraw, ImageFont
# # # import textwrap
# # # from pathlib import Path
# # # from config import Config
# # # import os


# # # class SlideRenderer:
# # #     """Render PPT-style text slides as images"""
    
# # #     def __init__(self):
# # #         self.width = 1920
# # #         self.height = 1080
# # #         self.bg_color = (255, 255, 255)  # White background
# # #         self.title_color = (0, 51, 102)  # Dark blue
# # #         self.text_color = (51, 51, 51)   # Dark gray
# # #         self.accent_color = (0, 102, 204)  # Blue accent
    
# # #     @staticmethod
# # #     def sanitize_filename(text: str, max_length: int = 30) -> str:
# # #         """Sanitize text for use in filenames"""
# # #         text = text[:max_length]
# # #         text = text.replace(' ', '_').replace(':', '').replace('/', '_').replace('\\', '_')
# # #         text = text.replace('"', '').replace("'", '').replace('?', '').replace('!', '')
# # #         text = text.replace('*', '').replace('<', '').replace('>', '').replace('|', '')
# # #         return text
    
# # #     def get_fonts(self):
# # #         """Get fonts with proper fallback for Windows"""
# # #         try:
# # #             # Try Windows fonts first
# # #             if os.name == 'nt':  # Windows
# # #                 title_font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 84)
# # #                 content_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 52)
# # #                 small_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 40)
# # #             else:  # Linux
# # #                 title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 84)
# # #                 content_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 52)
# # #                 small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
# # #         except Exception as e:
# # #             print(f"⚠️ Could not load system fonts: {e}")
# # #             print("   Using PIL default (text will be smaller)")
# # #             title_font = ImageFont.load_default()
# # #             content_font = ImageFont.load_default()
# # #             small_font = ImageFont.load_default()
        
# # #         return title_font, content_font, small_font
    
# # #     def wrap_text_dynamic(self, text: str, font, max_width: int, draw) -> list:
# # #         """Wrap text dynamically to fit within max_width using actual pixel measurements"""
# # #         words = text.split()
# # #         lines = []
# # #         current_line = []
        
# # #         for word in words:
# # #             test_line = ' '.join(current_line + [word])
# # #             # Use textlength for accurate width measurement
# # #             try:
# # #                 width = draw.textlength(test_line, font=font)
# # #             except AttributeError:
# # #                 # Fallback for older Pillow versions
# # #                 bbox = draw.textbbox((0, 0), test_line, font=font)
# # #                 width = bbox[2] - bbox[0]
            
# # #             if width <= max_width:
# # #                 current_line.append(word)
# # #             else:
# # #                 if current_line:
# # #                     lines.append(' '.join(current_line))
# # #                 current_line = [word]
        
# # #         if current_line:
# # #             lines.append(' '.join(current_line))
        
# # #         return lines
        
# # #     def create_text_slide(self, title: str, content: str, slide_number: int, topic: str) -> str:
# # #         """Create a professional text-only slide image with FULL WIDTH text"""
        
# # #         # Create image with gradient background
# # #         img = Image.new('RGB', (self.width, self.height), self.bg_color)
# # #         draw = ImageDraw.Draw(img)
        
# # #         # Load fonts
# # #         title_font, content_font, small_font = self.get_fonts()
        
# # #         # Draw top accent bar
# # #         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
# # #         # Draw decorative side bar
# # #         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        
# # #         # Draw title section background
# # #         draw.rectangle([15, 20, self.width, 280], fill=(240, 247, 255))
        
# # #         # Draw title (centered)
# # #         title_y = 90
# # #         title_wrapped = textwrap.fill(title, width=40)  # Wider for full-width slides
        
# # #         bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
# # #         title_width = bbox[2] - bbox[0]
# # #         title_x = (self.width - title_width) // 2
        
# # #         draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
# # #         # Draw separator line
# # #         draw.rectangle([80, 280, self.width - 80, 285], fill=self.accent_color)
        
# # #         # Draw content with FULL WIDTH (no right-side constraint)
# # #         content_y = 380
# # #         content_lines = content.split('\n')
        
# # #         # Use full width for text (with margins)
# # #         text_left_margin = 120
# # #         text_right_margin = 120
# # #         max_text_width = self.width - text_left_margin - text_right_margin
        
# # #         for line in content_lines:
# # #             if line.strip():
# # #                 # Remove bullet markers first
# # #                 clean_line = line.strip().lstrip('-• ').strip()
# # #                 is_bullet = line.strip().startswith(('-', '•'))
                
# # #                 # Wrap text dynamically based on actual width
# # #                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, max_text_width, draw)
                
# # #                 for wrapped in wrapped_lines:
# # #                     if is_bullet:
# # #                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
# # #                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
# # #                         is_bullet = False  # Only first line gets bullet
# # #                     else:
# # #                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
# # #                     # Calculate line height
# # #                     bbox = draw.textbbox((0, 0), wrapped, font=content_font)
# # #                     line_height = bbox[3] - bbox[1]
# # #                     content_y += line_height + 30
        
# # #         # Draw footer
# # #         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
# # #         slide_num_text = f"Slide {slide_number}"
# # #         draw.text((self.width - 280, self.height - 50), slide_num_text, 
# # #                  font=small_font, fill=self.accent_color)
        
# # #         # Save slide
# # #         topic_name = self.sanitize_filename(topic, max_length=30)
# # #         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
# # #         img.save(slide_path)
        
# # #         return str(slide_path)
    
# # #     def create_slide_with_image(self, title: str, content: str, image_path: str, 
# # #                                 slide_number: int, topic: str) -> str:
# # #         """Create a professional slide with text LEFT and image RIGHT"""
        
# # #         # Create image
# # #         img = Image.new('RGB', (self.width, self.height), self.bg_color)
# # #         draw = ImageDraw.Draw(img)
        
# # #         # Load fonts
# # #         title_font, content_font, small_font = self.get_fonts()
        
# # #         # Draw top accent bar
# # #         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
# # #         # Draw decorative side bar
# # #         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        
# # #         # Draw title section
# # #         draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
# # #         # Draw title (centered)
# # #         title_y = 80
# # #         title_wrapped = textwrap.fill(title, width=35)
# # #         bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
# # #         title_width = bbox[2] - bbox[0]
# # #         title_x = (self.width - title_width) // 2
# # #         draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
# # #         # Draw separator line
# # #         draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
# # #         # Load and paste image on right side
# # #         try:
# # #             slide_img = Image.open(image_path)
# # #             img_width = 850
# # #             img_height = 700
# # #             slide_img.thumbnail((img_width, img_height), Image.Resampling.LANCZOS)
            
# # #             img_x = self.width - img_width - 60
# # #             img_y = 250
            
# # #             # Draw shadow and border
# # #             shadow_offset = 8
# # #             draw.rectangle(
# # #                 [img_x + shadow_offset, img_y + shadow_offset, 
# # #                  img_x + img_width + shadow_offset, img_y + img_height + shadow_offset],
# # #                 fill=(200, 200, 200)
# # #             )
# # #             draw.rectangle(
# # #                 [img_x - 5, img_y - 5, img_x + img_width + 5, img_y + img_height + 5],
# # #                 outline=self.accent_color,
# # #                 width=5
# # #             )
            
# # #             img.paste(slide_img, (img_x, img_y))
# # #         except Exception as e:
# # #             print(f"Error loading image: {e}")
        
# # #         # Draw content on LEFT side only
# # #         content_y = 280
# # #         content_lines = content.split('\n')
        
# # #         # Text constrained to left side
# # #         text_left_margin = 100
# # #         text_max_width = 850  # Leave space for right-side image
        
# # #         for line in content_lines:
# # #             if line.strip():
# # #                 clean_line = line.strip().lstrip('-• ').strip()
# # #                 is_bullet = line.strip().startswith(('-', '•'))
                
# # #                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
# # #                 for wrapped in wrapped_lines:
# # #                     if is_bullet:
# # #                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
# # #                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
# # #                         is_bullet = False
# # #                     else:
# # #                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
# # #                     bbox = draw.textbbox((0, 0), wrapped, font=content_font)
# # #                     line_height = bbox[3] - bbox[1]
# # #                     content_y += line_height + 25
        
# # #         # Draw footer
# # #         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
# # #         slide_num_text = f"Slide {slide_number}"
# # #         draw.text((100, self.height - 50), slide_num_text, 
# # #                  font=small_font, fill=self.accent_color)
        
# # #         # Save slide
# # #         topic_name = self.sanitize_filename(topic, max_length=30)
# # #         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
# # #         img.save(slide_path)
        
# # #         return str(slide_path)
    
# # #     def create_slide_with_animation_placeholder(self, title: str, content: str, 
# # #                                                 slide_number: int, topic: str) -> str:
# # #         """Create a professional slide with text LEFT and animation placeholder RIGHT"""
        
# # #         # Create image
# # #         img = Image.new('RGB', (self.width, self.height), self.bg_color)
# # #         draw = ImageDraw.Draw(img)
        
# # #         # Load fonts
# # #         title_font, content_font, small_font = self.get_fonts()
        
# # #         # Draw top accent bar
# # #         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
# # #         # Draw decorative side bar
# # #         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        
# # #         # Draw title section
# # #         draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
# # #         # Draw title (centered)
# # #         title_y = 80
# # #         title_wrapped = textwrap.fill(title, width=35)
# # #         bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
# # #         title_width = bbox[2] - bbox[0]
# # #         title_x = (self.width - title_width) // 2
# # #         draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
# # #         # Draw separator line
# # #         draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
# # #         # Draw placeholder box on right side for animation
# # #         placeholder_x = self.width - 850 - 60
# # #         placeholder_y = 250
# # #         placeholder_width = 850
# # #         placeholder_height = 700
        
# # #         # Draw shadow
# # #         shadow_offset = 8
# # #         draw.rectangle(
# # #             [placeholder_x + shadow_offset, placeholder_y + shadow_offset,
# # #              placeholder_x + placeholder_width + shadow_offset, 
# # #              placeholder_y + placeholder_height + shadow_offset],
# # #             fill=(200, 200, 200)
# # #         )
        
# # #         # Draw placeholder background with pattern
# # #         draw.rectangle(
# # #             [placeholder_x, placeholder_y, 
# # #              placeholder_x + placeholder_width, placeholder_y + placeholder_height],
# # #             fill=(245, 250, 255),
# # #             outline=self.accent_color,
# # #             width=5
# # #         )
        
# # #         # Draw grid pattern
# # #         grid_spacing = 50
# # #         for i in range(placeholder_x, placeholder_x + placeholder_width, grid_spacing):
# # #             draw.line([(i, placeholder_y), (i, placeholder_y + placeholder_height)], 
# # #                      fill=(230, 240, 250), width=1)
# # #         for i in range(placeholder_y, placeholder_y + placeholder_height, grid_spacing):
# # #             draw.line([(placeholder_x, i), (placeholder_x + placeholder_width, i)], 
# # #                      fill=(230, 240, 250), width=1)
        
# # #         # Draw "Animation" text in center
# # #         placeholder_text = "🎬 Animation"
# # #         bbox = draw.textbbox((0, 0), placeholder_text, font=title_font)
# # #         text_width = bbox[2] - bbox[0]
# # #         text_height = bbox[3] - bbox[1]
# # #         text_x = placeholder_x + (placeholder_width - text_width) // 2
# # #         text_y = placeholder_y + (placeholder_height - text_height) // 2
# # #         draw.text((text_x, text_y), placeholder_text, font=title_font, fill=self.accent_color)
        
# # #         # Draw content on LEFT side only
# # #         content_y = 280
# # #         content_lines = content.split('\n')
        
# # #         text_left_margin = 100
# # #         text_max_width = 850
        
# # #         for line in content_lines:
# # #             if line.strip():
# # #                 clean_line = line.strip().lstrip('-• ').strip()
# # #                 is_bullet = line.strip().startswith(('-', '•'))
                
# # #                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
# # #                 for wrapped in wrapped_lines:
# # #                     if is_bullet:
# # #                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
# # #                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
# # #                         is_bullet = False
# # #                     else:
# # #                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
# # #                     bbox = draw.textbbox((0, 0), wrapped, font=content_font)
# # #                     line_height = bbox[3] - bbox[1]
# # #                     content_y += line_height + 25
        
# # #         # Draw footer
# # #         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
# # #         slide_num_text = f"Slide {slide_number}"
# # #         draw.text((100, self.height - 50), slide_num_text, 
# # #                  font=small_font, fill=self.accent_color)
        
# # #         # Save slide
# # #         topic_name = self.sanitize_filename(topic, max_length=30)
# # #         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}_base.png"
# # #         img.save(slide_path)
        
# # #         return str(slide_path)

# # # # slide_renderer.py - Updated version


# # # above code is previous code

# # from PIL import Image, ImageDraw, ImageFont
# # import textwrap
# # from pathlib import Path
# # from config import Config
# # import os


# # class SlideRenderer:
# #     """Render PPT-style text slides as images"""
    
# #     def __init__(self):
# #         self.width = 1920
# #         self.height = 1080
# #         self.bg_color = (255, 255, 255)  # White background
# #         self.title_color = (0, 51, 102)  # Dark blue
# #         self.text_color = (51, 51, 51)   # Dark gray
# #         self.accent_color = (0, 102, 204)  # Blue accent
    
# #     @staticmethod
# #     def sanitize_filename(text: str, max_length: int = 30) -> str:
# #         """Sanitize text for use in filenames"""
# #         text = text[:max_length]
# #         # Remove all problematic characters
# #         invalid_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*', "'", '!']
# #         for char in invalid_chars:
# #             text = text.replace(char, '')
# #         text = text.replace(' ', '_')
# #         return text
    
# #     def get_fonts(self):
# #         """Get fonts with proper fallback for Windows/Linux/Mac"""
# #         try:
# #             if os.name == 'nt':  # Windows
# #                 title_font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 84)
# #                 content_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 52)
# #                 small_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 40)
# #             elif os.path.exists("/usr/share/fonts/truetype/dejavu"):  # Linux
# #                 title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 84)
# #                 content_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 52)
# #                 small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
# #             else:  # Mac or other
# #                 title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 84)
# #                 content_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 52)
# #                 small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
# #         except Exception as e:
# #             print(f"⚠️ Could not load system fonts: {e}")
# #             print("   Using PIL default font (text will be smaller)")
# #             title_font = ImageFont.load_default()
# #             content_font = ImageFont.load_default()
# #             small_font = ImageFont.load_default()
        
# #         return title_font, content_font, small_font
    
# #     def wrap_text_dynamic(self, text: str, font, max_width: int, draw) -> list:
# #         """Wrap text dynamically to fit within max_width using actual pixel measurements"""
# #         words = text.split()
# #         lines = []
# #         current_line = []
        
# #         for word in words:
# #             test_line = ' '.join(current_line + [word])
            
# #             # Use textlength for accurate width measurement (Pillow 8.0+)
# #             try:
# #                 width = draw.textlength(test_line, font=font)
# #             except AttributeError:
# #                 # Fallback for older Pillow versions
# #                 bbox = draw.textbbox((0, 0), test_line, font=font)
# #                 width = bbox[2] - bbox[0]
            
# #             if width <= max_width:
# #                 current_line.append(word)
# #             else:
# #                 if current_line:
# #                     lines.append(' '.join(current_line))
# #                 current_line = [word]
        
# #         if current_line:
# #             lines.append(' '.join(current_line))
        
# #         return lines if lines else [text]  # Return original text if wrapping fails
    
# #     def create_text_slide(self, title: str, content: str, slide_number: int, topic: str) -> str:
# #         """Create a professional text-only slide image with FULL WIDTH text"""
        
# #         # Create image with white background
# #         img = Image.new('RGB', (self.width, self.height), self.bg_color)
# #         draw = ImageDraw.Draw(img)
        
# #         # Load fonts
# #         title_font, content_font, small_font = self.get_fonts()
        
# #         # Draw top accent bar
# #         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
# #         # Draw decorative side bar
# #         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        
# #         # Draw title section background
# #         draw.rectangle([15, 20, self.width, 280], fill=(240, 247, 255))
        
# #         # Draw title (centered)
# #         title_y = 90
# #         title_wrapped = textwrap.fill(title, width=40)
        
# #         try:
# #             bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
# #             title_width = bbox[2] - bbox[0]
# #         except:
# #             title_width = len(title_wrapped) * 40  # Rough estimate
        
# #         title_x = (self.width - title_width) // 2
# #         draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
# #         # Draw separator line
# #         draw.rectangle([80, 280, self.width - 80, 285], fill=self.accent_color)
        
# #         # Draw content with FULL WIDTH
# #         content_y = 380
# #         content_lines = content.split('\n')
        
# #         # Use full width for text (with margins)
# #         text_left_margin = 120
# #         text_right_margin = 120
# #         max_text_width = self.width - text_left_margin - text_right_margin
        
# #         for line in content_lines:
# #             if line.strip():
# #                 # Remove bullet markers first
# #                 clean_line = line.strip().lstrip('-• ').strip()
# #                 is_bullet = line.strip().startswith(('-', '•'))
                
# #                 # Wrap text dynamically based on actual width
# #                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, max_text_width, draw)
                
# #                 for wrapped in wrapped_lines:
# #                     if is_bullet:
# #                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
# #                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
# #                         is_bullet = False  # Only first line gets bullet
# #                     else:
# #                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
# #                     # Calculate line height
# #                     try:
# #                         bbox = draw.textbbox((0, 0), wrapped, font=content_font)
# #                         line_height = bbox[3] - bbox[1]
# #                     except:
# #                         line_height = 60  # Default line height
                    
# #                     content_y += line_height + 30
        
# #         # Draw footer
# #         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
# #         slide_num_text = f"Slide {slide_number}"
# #         draw.text((self.width - 280, self.height - 50), slide_num_text, 
# #                  font=small_font, fill=self.accent_color)
        
# #         # Save slide
# #         topic_name = self.sanitize_filename(topic, max_length=30)
# #         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
# #         img.save(slide_path, quality=95)  # Added quality parameter
        
# #         print(f"   ✅ Created text slide: {slide_path.name}")
# #         return str(slide_path)
    
# #     def create_slide_with_image(self, title: str, content: str, image_path: str, 
# #                                 slide_number: int, topic: str) -> str:
# #         """Create a professional slide with text LEFT and image RIGHT"""
        
# #         # Create image
# #         img = Image.new('RGB', (self.width, self.height), self.bg_color)
# #         draw = ImageDraw.Draw(img)
        
# #         # Load fonts
# #         title_font, content_font, small_font = self.get_fonts()
        
# #         # Draw top accent bar
# #         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
# #         # Draw decorative side bar
# #         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        
# #         # Draw title section
# #         draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
# #         # Draw title (centered)
# #         title_y = 80
# #         title_wrapped = textwrap.fill(title, width=35)
        
# #         try:
# #             bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
# #             title_width = bbox[2] - bbox[0]
# #         except:
# #             title_width = len(title_wrapped) * 40
        
# #         title_x = (self.width - title_width) // 2
# #         draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
# #         # Draw separator line
# #         draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
# #         # Load and paste image on right side
# #         try:
# #             slide_img = Image.open(image_path)
# #             img_width = 850
# #             img_height = 700
# #             slide_img.thumbnail((img_width, img_height), Image.Resampling.LANCZOS)
            
# #             img_x = self.width - img_width - 60
# #             img_y = 250
            
# #             # Draw shadow
# #             shadow_offset = 8
# #             draw.rectangle(
# #                 [img_x + shadow_offset, img_y + shadow_offset, 
# #                  img_x + img_width + shadow_offset, img_y + img_height + shadow_offset],
# #                 fill=(200, 200, 200)
# #             )
            
# #             # Draw border
# #             draw.rectangle(
# #                 [img_x - 5, img_y - 5, img_x + img_width + 5, img_y + img_height + 5],
# #                 outline=self.accent_color,
# #                 width=5
# #             )
            
# #             img.paste(slide_img, (img_x, img_y))
# #             print(f"   🖼️ Added image: {Path(image_path).name}")
# #         except Exception as e:
# #             print(f"   ⚠️ Error loading image: {e}")
        
# #         # Draw content on LEFT side only
# #         content_y = 280
# #         content_lines = content.split('\n')
        
# #         # Text constrained to left side
# #         text_left_margin = 100
# #         text_max_width = 850  # Leave space for right-side image
        
# #         for line in content_lines:
# #             if line.strip():
# #                 clean_line = line.strip().lstrip('-• ').strip()
# #                 is_bullet = line.strip().startswith(('-', '•'))
                
# #                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
# #                 for wrapped in wrapped_lines:
# #                     if is_bullet:
# #                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
# #                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
# #                         is_bullet = False
# #                     else:
# #                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
# #                     try:
# #                         bbox = draw.textbbox((0, 0), wrapped, font=content_font)
# #                         line_height = bbox[3] - bbox[1]
# #                     except:
# #                         line_height = 60
                    
# #                     content_y += line_height + 25
        
# #         # Draw footer
# #         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
# #         slide_num_text = f"Slide {slide_number}"
# #         draw.text((100, self.height - 50), slide_num_text, 
# #                  font=small_font, fill=self.accent_color)
        
# #         # Save slide
# #         topic_name = self.sanitize_filename(topic, max_length=30)
# #         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
# #         img.save(slide_path, quality=95)
        
# #         print(f"   ✅ Created image slide: {slide_path.name}")
# #         return str(slide_path)
    
# #     def create_slide_with_animation_placeholder(self, title: str, content: str, 
# #                                                 slide_number: int, topic: str) -> str:
# #         """Create a professional slide with text LEFT and animation placeholder RIGHT"""
        
# #         # Create image
# #         img = Image.new('RGB', (self.width, self.height), self.bg_color)
# #         draw = ImageDraw.Draw(img)
        
# #         # Load fonts
# #         title_font, content_font, small_font = self.get_fonts()
        
# #         # Draw top accent bar
# #         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        
# #         # Draw decorative side bar
# #         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        
# #         # Draw title section
# #         draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
# #         # Draw title (centered)
# #         title_y = 80
# #         title_wrapped = textwrap.fill(title, width=35)
        
# #         try:
# #             bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
# #             title_width = bbox[2] - bbox[0]
# #         except:
# #             title_width = len(title_wrapped) * 40
        
# #         title_x = (self.width - title_width) // 2
# #         draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
# #         # Draw separator line
# #         draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
# #         # Draw placeholder box on right side for animation
# #         placeholder_x = self.width - 850 - 60  # 1010
# #         placeholder_y = 250
# #         placeholder_width = 850
# #         placeholder_height = 700
        
# #         # Draw shadow
# #         shadow_offset = 8
# #         draw.rectangle(
# #             [placeholder_x + shadow_offset, placeholder_y + shadow_offset,
# #              placeholder_x + placeholder_width + shadow_offset, 
# #              placeholder_y + placeholder_height + shadow_offset],
# #             fill=(200, 200, 200)
# #         )
        
# #         # Draw placeholder background with pattern
# #         draw.rectangle(
# #             [placeholder_x, placeholder_y, 
# #              placeholder_x + placeholder_width, placeholder_y + placeholder_height],
# #             fill=(245, 250, 255),
# #             outline=self.accent_color,
# #             width=5
# #         )
        
# #         # Draw grid pattern
# #         grid_spacing = 50
# #         for i in range(placeholder_x, placeholder_x + placeholder_width, grid_spacing):
# #             draw.line([(i, placeholder_y), (i, placeholder_y + placeholder_height)], 
# #                      fill=(230, 240, 250), width=1)
# #         for i in range(placeholder_y, placeholder_y + placeholder_height, grid_spacing):
# #             draw.line([(placeholder_x, i), (placeholder_x + placeholder_width, i)], 
# #                      fill=(230, 240, 250), width=1)
        
# #         # Draw "Animation" text in center
# #         placeholder_text = "🎬 Animation"
        
# #         try:
# #             bbox = draw.textbbox((0, 0), placeholder_text, font=title_font)
# #             text_width = bbox[2] - bbox[0]
# #             text_height = bbox[3] - bbox[1]
# #         except:
# #             text_width = len(placeholder_text) * 40
# #             text_height = 80
        
# #         text_x = placeholder_x + (placeholder_width - text_width) // 2
# #         text_y = placeholder_y + (placeholder_height - text_height) // 2
# #         draw.text((text_x, text_y), placeholder_text, font=title_font, fill=self.accent_color)
        
# #         # Draw content on LEFT side only
# #         content_y = 280
# #         content_lines = content.split('\n')
        
# #         text_left_margin = 100
# #         text_max_width = 850
        
# #         for line in content_lines:
# #             if line.strip():
# #                 clean_line = line.strip().lstrip('-• ').strip()
# #                 is_bullet = line.strip().startswith(('-', '•'))
                
# #                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
# #                 for wrapped in wrapped_lines:
# #                     if is_bullet:
# #                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
# #                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
# #                         is_bullet = False
# #                     else:
# #                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
# #                     try:
# #                         bbox = draw.textbbox((0, 0), wrapped, font=content_font)
# #                         line_height = bbox[3] - bbox[1]
# #                     except:
# #                         line_height = 60
                    
# #                     content_y += line_height + 25
        
# #         # Draw footer
# #         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
# #         slide_num_text = f"Slide {slide_number}"
# #         draw.text((100, self.height - 50), slide_num_text, 
# #                  font=small_font, fill=self.accent_color)
        
# #         # Save slide
# #         topic_name = self.sanitize_filename(topic, max_length=30)
# #         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}_base.png"
# #         img.save(slide_path, quality=95)
        
# #         print(f"   ✅ Created animation placeholder slide: {slide_path.name}")
# #         return str(slide_path)

# # # some working code 
# # from PIL import Image, ImageDraw, ImageFont
# # import textwrap
# # from pathlib import Path
# # from config import Config
# # import os
# # import re


# # class SlideRenderer:
# #     """Render PPT-style text slides as images"""
    
# #     def __init__(self):
# #         self.width = 1920
# #         self.height = 1080
# #         self.bg_color = (255, 255, 255)  # White background
# #         self.title_color = (0, 51, 102)  # Dark blue
# #         self.text_color = (51, 51, 51)   # Dark gray
# #         self.accent_color = (0, 102, 204)  # Blue accent
    
# #     @staticmethod
# #     def sanitize_filename(text: str, max_length: int = 30) -> str:
# #         """Sanitize text for use in filenames"""
# #         text = text[:max_length]
# #         invalid_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*', "'", '!']
# #         for char in invalid_chars:
# #             text = text.replace(char, '')
# #         text = text.replace(' ', '_')
# #         return text
    
# #     @staticmethod
# #     def clean_markdown(text: str) -> str:
# #         """Remove markdown formatting from text"""
# #         # Remove ** bold markers
# #         text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
# #         # Remove * italic markers
# #         text = re.sub(r'\*(.+?)\*', r'\1', text)
# #         # Remove __ bold markers
# #         text = re.sub(r'__(.+?)__', r'\1', text)
# #         # Remove _ italic markers
# #         text = re.sub(r'_(.+?)_', r'\1', text)
# #         return text
    
# #     def get_fonts(self):
# #         """Get fonts with proper fallback for Windows/Linux/Mac"""
# #         try:
# #             if os.name == 'nt':  # Windows
# #                 title_font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 84)
# #                 content_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 48)  # Reduced from 52
# #                 small_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 36)   # Reduced from 40
# #             elif os.path.exists("/usr/share/fonts/truetype/dejavu"):  # Linux
# #                 title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 84)
# #                 content_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
# #                 small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
# #             else:  # Mac or other
# #                 title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 84)
# #                 content_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
# #                 small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
# #         except Exception as e:
# #             print(f"⚠️ Could not load system fonts: {e}")
# #             print("   Using PIL default font (text will be smaller)")
# #             title_font = ImageFont.load_default()
# #             content_font = ImageFont.load_default()
# #             small_font = ImageFont.load_default()
        
# #         return title_font, content_font, small_font
    
# #     def wrap_text_dynamic(self, text: str, font, max_width: int, draw) -> list:
# #         """Wrap text dynamically to fit within max_width using actual pixel measurements"""
# #         words = text.split()
# #         lines = []
# #         current_line = []
        
# #         for word in words:
# #             test_line = ' '.join(current_line + [word])
            
# #             try:
# #                 width = draw.textlength(test_line, font=font)
# #             except AttributeError:
# #                 bbox = draw.textbbox((0, 0), test_line, font=font)
# #                 width = bbox[2] - bbox[0]
            
# #             if width <= max_width:
# #                 current_line.append(word)
# #             else:
# #                 if current_line:
# #                     lines.append(' '.join(current_line))
# #                 current_line = [word]
        
# #         if current_line:
# #             lines.append(' '.join(current_line))
        
# #         return lines if lines else [text]
    
# #     def create_text_slide(self, title: str, content: str, slide_number: int, topic: str) -> str:
# #         """Create a professional text-only slide image with FULL WIDTH text"""
        
# #         # Clean markdown from title and content
# #         title = self.clean_markdown(title)
# #         content = self.clean_markdown(content)
        
# #         img = Image.new('RGB', (self.width, self.height), self.bg_color)
# #         draw = ImageDraw.Draw(img)
        
# #         title_font, content_font, small_font = self.get_fonts()
        
# #         # Draw top accent bar
# #         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
# #         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
# #         draw.rectangle([15, 20, self.width, 280], fill=(240, 247, 255))
        
# #         # Draw title (centered)
# #         title_y = 90
# #         title_wrapped = textwrap.fill(title, width=40)
        
# #         try:
# #             bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
# #             title_width = bbox[2] - bbox[0]
# #         except:
# #             title_width = len(title_wrapped) * 40
        
# #         title_x = (self.width - title_width) // 2
# #         draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
# #         # Draw separator line
# #         draw.rectangle([80, 280, self.width - 80, 285], fill=self.accent_color)
        
# #         # Draw content with FULL WIDTH and overflow protection
# #         content_y = 350  # Start a bit higher
# #         content_lines = content.split('\n')
        
# #         text_left_margin = 120
# #         text_right_margin = 120
# #         max_text_width = self.width - text_left_margin - text_right_margin
# #         max_y = self.height - 120  # Stop before footer (increased margin)
        
# #         for line in content_lines:
# #             if line.strip():
# #                 # Stop if we're running out of space
# #                 if content_y > max_y:
# #                     print(f"   ⚠️ Content overflow detected on slide {slide_number}, truncating...")
# #                     break
                
# #                 clean_line = line.strip().lstrip('-• ').strip()
# #                 is_bullet = line.strip().startswith(('-', '•'))
                
# #                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, max_text_width, draw)
                
# #                 for wrapped in wrapped_lines:
# #                     # Check space before drawing each line
# #                     if content_y > max_y:
# #                         break
                    
# #                     if is_bullet:
# #                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
# #                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
# #                         is_bullet = False
# #                     else:
# #                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
# #                     try:
# #                         bbox = draw.textbbox((0, 0), wrapped, font=content_font)
# #                         line_height = bbox[3] - bbox[1]
# #                     except:
# #                         line_height = 56
                    
# #                     content_y += line_height + 25  # Reduced spacing from 30 to 25
        
# #         # Draw footer
# #         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
# #         slide_num_text = f"Slide {slide_number}"
# #         draw.text((self.width - 280, self.height - 50), slide_num_text, 
# #                  font=small_font, fill=self.accent_color)
        
# #         topic_name = self.sanitize_filename(topic, max_length=30)
# #         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
# #         img.save(slide_path, quality=95)
        
# #         print(f"   ✅ Created text slide: {slide_path.name}")
# #         return str(slide_path)
    
# #     def create_slide_with_image(self, title: str, content: str, image_path: str, 
# #                                 slide_number: int, topic: str) -> str:
# #         """Create a professional slide with text LEFT and image RIGHT"""
        
# #         # Clean markdown
# #         title = self.clean_markdown(title)
# #         content = self.clean_markdown(content)
        
# #         img = Image.new('RGB', (self.width, self.height), self.bg_color)
# #         draw = ImageDraw.Draw(img)
        
# #         title_font, content_font, small_font = self.get_fonts()
        
# #         # Draw top accent bar
# #         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
# #         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
# #         draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
# #         # Draw title (centered)
# #         title_y = 80
# #         title_wrapped = textwrap.fill(title, width=35)
        
# #         try:
# #             bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
# #             title_width = bbox[2] - bbox[0]
# #         except:
# #             title_width = len(title_wrapped) * 40
        
# #         title_x = (self.width - title_width) // 2
# #         draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
# #         # Draw separator line
# #         draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
# #         # Load and paste image on right side
# #         try:
# #             slide_img = Image.open(image_path)
# #             img_width = 850
# #             img_height = 700
# #             slide_img.thumbnail((img_width, img_height), Image.Resampling.LANCZOS)
            
# #             img_x = self.width - img_width - 60
# #             img_y = 250
            
# #             shadow_offset = 8
# #             draw.rectangle(
# #                 [img_x + shadow_offset, img_y + shadow_offset, 
# #                  img_x + img_width + shadow_offset, img_y + img_height + shadow_offset],
# #                 fill=(200, 200, 200)
# #             )
# #             draw.rectangle(
# #                 [img_x - 5, img_y - 5, img_x + img_width + 5, img_y + img_height + 5],
# #                 outline=self.accent_color,
# #                 width=5
# #             )
            
# #             img.paste(slide_img, (img_x, img_y))
# #             print(f"   🖼️ Added image: {Path(image_path).name}")
# #         except Exception as e:
# #             print(f"   ⚠️ Error loading image: {e}")
        
# #         # Draw content on LEFT side with overflow protection
# #         content_y = 250  # Start higher
# #         content_lines = content.split('\n')
        
# #         text_left_margin = 100
# #         text_max_width = 850
# #         max_y = self.height - 100  # Stop before footer
        
# #         for line in content_lines:
# #             if line.strip():
# #                 if content_y > max_y:
# #                     print(f"   ⚠️ Content overflow on slide {slide_number}")
# #                     break
                
# #                 clean_line = line.strip().lstrip('-• ').strip()
# #                 is_bullet = line.strip().startswith(('-', '•'))
                
# #                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
# #                 for wrapped in wrapped_lines:
# #                     if content_y > max_y:
# #                         break
                    
# #                     if is_bullet:
# #                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
# #                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
# #                         is_bullet = False
# #                     else:
# #                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
# #                     try:
# #                         bbox = draw.textbbox((0, 0), wrapped, font=content_font)
# #                         line_height = bbox[3] - bbox[1]
# #                     except:
# #                         line_height = 56
                    
# #                     content_y += line_height + 22  # Reduced spacing
        
# #         # Draw footer
# #         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
# #         slide_num_text = f"Slide {slide_number}"
# #         draw.text((100, self.height - 50), slide_num_text, 
# #                  font=small_font, fill=self.accent_color)
        
# #         topic_name = self.sanitize_filename(topic, max_length=30)
# #         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
# #         img.save(slide_path, quality=95)
        
# #         print(f"   ✅ Created image slide: {slide_path.name}")
# #         return str(slide_path)
    
# #     def create_slide_with_animation_placeholder(self, title: str, content: str, 
# #                                                 slide_number: int, topic: str) -> str:
# #         """Create a professional slide with text LEFT and animation placeholder RIGHT"""
        
# #         # Clean markdown
# #         title = self.clean_markdown(title)
# #         content = self.clean_markdown(content)
        
# #         img = Image.new('RGB', (self.width, self.height), self.bg_color)
# #         draw = ImageDraw.Draw(img)
        
# #         title_font, content_font, small_font = self.get_fonts()
        
# #         # Draw top accent bar
# #         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
# #         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
# #         draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
# #         # Draw title (centered)
# #         title_y = 80
# #         title_wrapped = textwrap.fill(title, width=35)
        
# #         try:
# #             bbox = draw.textbbox((0, 0), title_wrapped, font=title_font)
# #             title_width = bbox[2] - bbox[0]
# #         except:
# #             title_width = len(title_wrapped) * 40
        
# #         title_x = (self.width - title_width) // 2
# #         draw.text((title_x, title_y), title_wrapped, font=title_font, fill=self.title_color)
        
# #         # Draw separator line
# #         draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
# #         # Draw placeholder box on right side
# #         placeholder_x = self.width - 850 - 60
# #         placeholder_y = 250
# #         placeholder_width = 850
# #         placeholder_height = 700
        
# #         shadow_offset = 8
# #         draw.rectangle(
# #             [placeholder_x + shadow_offset, placeholder_y + shadow_offset,
# #              placeholder_x + placeholder_width + shadow_offset, 
# #              placeholder_y + placeholder_height + shadow_offset],
# #             fill=(200, 200, 200)
# #         )
        
# #         draw.rectangle(
# #             [placeholder_x, placeholder_y, 
# #              placeholder_x + placeholder_width, placeholder_y + placeholder_height],
# #             fill=(245, 250, 255),
# #             outline=self.accent_color,
# #             width=5
# #         )
        
# #         # Draw grid pattern
# #         grid_spacing = 50
# #         for i in range(placeholder_x, placeholder_x + placeholder_width, grid_spacing):
# #             draw.line([(i, placeholder_y), (i, placeholder_y + placeholder_height)], 
# #                      fill=(230, 240, 250), width=1)
# #         for i in range(placeholder_y, placeholder_y + placeholder_height, grid_spacing):
# #             draw.line([(placeholder_x, i), (placeholder_x + placeholder_width, i)], 
# #                      fill=(230, 240, 250), width=1)
        
# #         # Draw "Animation" text in center
# #         placeholder_text = "🎬 Animation"
        
# #         try:
# #             bbox = draw.textbbox((0, 0), placeholder_text, font=title_font)
# #             text_width = bbox[2] - bbox[0]
# #             text_height = bbox[3] - bbox[1]
# #         except:
# #             text_width = len(placeholder_text) * 40
# #             text_height = 80
        
# #         text_x = placeholder_x + (placeholder_width - text_width) // 2
# #         text_y = placeholder_y + (placeholder_height - text_height) // 2
# #         draw.text((text_x, text_y), placeholder_text, font=title_font, fill=self.accent_color)
        
# #         # Draw content on LEFT side with overflow protection
# #         content_y = 250
# #         content_lines = content.split('\n')
        
# #         text_left_margin = 100
# #         text_max_width = 850
# #         max_y = self.height - 100
        
# #         for line in content_lines:
# #             if line.strip():
# #                 if content_y > max_y:
# #                     print(f"   ⚠️ Content overflow on slide {slide_number}")
# #                     break
                
# #                 clean_line = line.strip().lstrip('-• ').strip()
# #                 is_bullet = line.strip().startswith(('-', '•'))
                
# #                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
# #                 for wrapped in wrapped_lines:
# #                     if content_y > max_y:
# #                         break
                    
# #                     if is_bullet:
# #                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
# #                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
# #                         is_bullet = False
# #                     else:
# #                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
# #                     try:
# #                         bbox = draw.textbbox((0, 0), wrapped, font=content_font)
# #                         line_height = bbox[3] - bbox[1]
# #                     except:
# #                         line_height = 56
                    
# #                     content_y += line_height + 22
        
# #         # Draw footer
# #         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
# #         slide_num_text = f"Slide {slide_number}"
# #         draw.text((100, self.height - 50), slide_num_text, 
# #                  font=small_font, fill=self.accent_color)
        
# #         topic_name = self.sanitize_filename(topic, max_length=30)
# #         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}_base.png"
# #         img.save(slide_path, quality=95)
        
# #         print(f"   ✅ Created animation placeholder slide: {slide_path.name}")
# #         return str(slide_path)
# from PIL import Image, ImageDraw, ImageFont
# import textwrap
# from pathlib import Path
# from config import Config
# import os
# import re


# class SlideRenderer:
#     """Render PPT-style text slides as images"""
    
#     def __init__(self):
#         self.width = 1920
#         self.height = 1080
#         self.bg_color = (255, 255, 255)  # White background
#         self.title_color = (0, 51, 102)  # Dark blue
#         self.text_color = (51, 51, 51)   # Dark gray
#         self.accent_color = (0, 102, 204)  # Blue accent
    
#     @staticmethod
#     def sanitize_filename(text: str, max_length: int = 30) -> str:
#         """Sanitize text for use in filenames"""
#         text = text[:max_length]
#         invalid_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*', "'", '!']
#         for char in invalid_chars:
#             text = text.replace(char, '')
#         text = text.replace(' ', '_')
#         return text
    
#     @staticmethod
#     def clean_markdown(text: str) -> str:
#         """Remove markdown formatting from text"""
#         text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
#         text = re.sub(r'\*(.+?)\*', r'\1', text)
#         text = re.sub(r'__(.+?)__', r'\1', text)
#         text = re.sub(r'_(.+?)_', r'\1', text)
#         return text
    
#     def get_fonts(self):
#         """Get fonts with proper fallback for Windows/Linux/Mac"""
#         try:
#             if os.name == 'nt':  # Windows
#                 title_font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 80)  # Reduced from 84
#                 content_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 48)
#                 small_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 36)
#             elif os.path.exists("/usr/share/fonts/truetype/dejavu"):  # Linux
#                 title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
#                 content_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
#                 small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
#             else:  # Mac or other
#                 title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 80)
#                 content_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
#                 small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
#         except Exception as e:
#             print(f"⚠️ Could not load system fonts: {e}")
#             print("   Using PIL default font (text will be smaller)")
#             title_font = ImageFont.load_default()
#             content_font = ImageFont.load_default()
#             small_font = ImageFont.load_default()
        
#         return title_font, content_font, small_font
    
#     def wrap_text_dynamic(self, text: str, font, max_width: int, draw) -> list:
#         """Wrap text dynamically to fit within max_width using actual pixel measurements"""
#         words = text.split()
#         lines = []
#         current_line = []
        
#         for word in words:
#             test_line = ' '.join(current_line + [word])
            
#             try:
#                 width = draw.textlength(test_line, font=font)
#             except AttributeError:
#                 bbox = draw.textbbox((0, 0), test_line, font=font)
#                 width = bbox[2] - bbox[0]
            
#             if width <= max_width:
#                 current_line.append(word)
#             else:
#                 if current_line:
#                     lines.append(' '.join(current_line))
#                 current_line = [word]
        
#         if current_line:
#             lines.append(' '.join(current_line))
        
#         return lines if lines else [text]
    
#     def create_text_slide(self, title: str, content: str, slide_number: int, topic: str) -> str:
#         """Create a professional text-only slide image with FULL WIDTH text"""
        
#         # Clean markdown from title and content
#         title = self.clean_markdown(title)
#         content = self.clean_markdown(content)
        
#         img = Image.new('RGB', (self.width, self.height), self.bg_color)
#         draw = ImageDraw.Draw(img)
        
#         title_font, content_font, small_font = self.get_fonts()
        
#         # Draw top accent bar
#         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
#         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
#         draw.rectangle([15, 20, self.width, 280], fill=(240, 247, 255))
        
#         # Draw title with dynamic wrapping (FIXED)
#         title_y = 70  # Adjusted to fit multi-line titles
#         max_title_width = self.width - 200  # Leave margins
        
#         # Use dynamic wrapping for title
#         title_lines = self.wrap_text_dynamic(title, title_font, max_title_width, draw)
        
#         for line in title_lines:
#             try:
#                 bbox = draw.textbbox((0, 0), line, font=title_font)
#                 line_width = bbox[2] - bbox[0]
#                 line_height = bbox[3] - bbox[1]
#             except:
#                 line_width = len(line) * 40
#                 line_height = 80
            
#             line_x = (self.width - line_width) // 2
#             draw.text((line_x, title_y), line, font=title_font, fill=self.title_color)
#             title_y += line_height + 10  # Space between title lines
        
#         # Draw separator line
#         draw.rectangle([80, 280, self.width - 80, 285], fill=self.accent_color)
        
#         # Draw content with FULL WIDTH and overflow protection
#         content_y = 350
#         content_lines = content.split('\n')
        
#         text_left_margin = 120
#         text_right_margin = 120
#         max_text_width = self.width - text_left_margin - text_right_margin
#         max_y = self.height - 120
        
#         for line in content_lines:
#             if line.strip():
#                 if content_y > max_y:
#                     print(f"   ⚠️ Content overflow detected on slide {slide_number}, truncating...")
#                     break
                
#                 clean_line = line.strip().lstrip('-• ').strip()
#                 is_bullet = line.strip().startswith(('-', '•'))
                
#                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, max_text_width, draw)
                
#                 for wrapped in wrapped_lines:
#                     if content_y > max_y:
#                         break
                    
#                     if is_bullet:
#                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
#                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
#                         is_bullet = False
#                     else:
#                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
#                     try:
#                         bbox = draw.textbbox((0, 0), wrapped, font=content_font)
#                         line_height = bbox[3] - bbox[1]
#                     except:
#                         line_height = 56
                    
#                     content_y += line_height + 25
        
#         # Draw footer
#         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
#         slide_num_text = f"Slide {slide_number}"
#         draw.text((self.width - 280, self.height - 50), slide_num_text, 
#                  font=small_font, fill=self.accent_color)
        
#         topic_name = self.sanitize_filename(topic, max_length=30)
#         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
#         img.save(slide_path, quality=95)
        
#         print(f"   ✅ Created text slide: {slide_path.name}")
#         return str(slide_path)
    
#     def create_slide_with_image(self, title: str, content: str, image_path: str, 
#                                 slide_number: int, topic: str) -> str:
#         """Create a professional slide with text LEFT and image RIGHT"""
        
#         # Clean markdown
#         title = self.clean_markdown(title)
#         content = self.clean_markdown(content)
        
#         img = Image.new('RGB', (self.width, self.height), self.bg_color)
#         draw = ImageDraw.Draw(img)
        
#         title_font, content_font, small_font = self.get_fonts()
        
#         # Draw top accent bar
#         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
#         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
#         draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
#         # Draw title with dynamic wrapping (FIXED)
#         title_y = 60
#         max_title_width = self.width - 200
        
#         title_lines = self.wrap_text_dynamic(title, title_font, max_title_width, draw)
        
#         for line in title_lines:
#             try:
#                 bbox = draw.textbbox((0, 0), line, font=title_font)
#                 line_width = bbox[2] - bbox[0]
#                 line_height = bbox[3] - bbox[1]
#             except:
#                 line_width = len(line) * 40
#                 line_height = 76
            
#             line_x = (self.width - line_width) // 2
#             draw.text((line_x, title_y), line, font=title_font, fill=self.title_color)
#             title_y += line_height + 8
        
#         # Draw separator line
#         draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
#         # Load and paste image on right side
#         try:
#             slide_img = Image.open(image_path)
#             img_width = 850
#             img_height = 700
#             slide_img.thumbnail((img_width, img_height), Image.Resampling.LANCZOS)
            
#             img_x = self.width - img_width - 60
#             img_y = 250
            
#             shadow_offset = 8
#             draw.rectangle(
#                 [img_x + shadow_offset, img_y + shadow_offset, 
#                  img_x + img_width + shadow_offset, img_y + img_height + shadow_offset],
#                 fill=(200, 200, 200)
#             )
#             draw.rectangle(
#                 [img_x - 5, img_y - 5, img_x + img_width + 5, img_y + img_height + 5],
#                 outline=self.accent_color,
#                 width=5
#             )
            
#             img.paste(slide_img, (img_x, img_y))
#             print(f"   🖼️ Added image: {Path(image_path).name}")
#         except Exception as e:
#             print(f"   ⚠️ Error loading image: {e}")
        
#         # Draw content on LEFT side with overflow protection
#         content_y = 250
#         content_lines = content.split('\n')
        
#         text_left_margin = 100
#         text_max_width = 850
#         max_y = self.height - 100
        
#         for line in content_lines:
#             if line.strip():
#                 if content_y > max_y:
#                     print(f"   ⚠️ Content overflow on slide {slide_number}")
#                     break
                
#                 clean_line = line.strip().lstrip('-• ').strip()
#                 is_bullet = line.strip().startswith(('-', '•'))
                
#                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
#                 for wrapped in wrapped_lines:
#                     if content_y > max_y:
#                         break
                    
#                     if is_bullet:
#                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
#                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
#                         is_bullet = False
#                     else:
#                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
#                     try:
#                         bbox = draw.textbbox((0, 0), wrapped, font=content_font)
#                         line_height = bbox[3] - bbox[1]
#                     except:
#                         line_height = 56
                    
#                     content_y += line_height + 22
        
#         # Draw footer
#         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
#         slide_num_text = f"Slide {slide_number}"
#         draw.text((100, self.height - 50), slide_num_text, 
#                  font=small_font, fill=self.accent_color)
        
#         topic_name = self.sanitize_filename(topic, max_length=30)
#         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
#         img.save(slide_path, quality=95)
        
#         print(f"   ✅ Created image slide: {slide_path.name}")
#         return str(slide_path)
    
#     def create_slide_with_animation_placeholder(self, title: str, content: str, 
#                                                 slide_number: int, topic: str) -> str:
#         """Create a professional slide with text LEFT and animation placeholder RIGHT"""
        
#         # Clean markdown
#         title = self.clean_markdown(title)
#         content = self.clean_markdown(content)
        
#         img = Image.new('RGB', (self.width, self.height), self.bg_color)
#         draw = ImageDraw.Draw(img)
        
#         title_font, content_font, small_font = self.get_fonts()
        
#         # Draw top accent bar
#         draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
#         draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
#         draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
#         # Draw title with dynamic wrapping (FIXED)
#         title_y = 60
#         max_title_width = self.width - 200
        
#         title_lines = self.wrap_text_dynamic(title, title_font, max_title_width, draw)
        
#         for line in title_lines:
#             try:
#                 bbox = draw.textbbox((0, 0), line, font=title_font)
#                 line_width = bbox[2] - bbox[0]
#                 line_height = bbox[3] - bbox[1]
#             except:
#                 line_width = len(line) * 40
#                 line_height = 76
            
#             line_x = (self.width - line_width) // 2
#             draw.text((line_x, title_y), line, font=title_font, fill=self.title_color)
#             title_y += line_height + 8
        
#         # Draw separator line
#         draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
#         # Draw placeholder box on right side
#         placeholder_x = self.width - 850 - 60
#         placeholder_y = 250
#         placeholder_width = 850
#         placeholder_height = 700
        
#         shadow_offset = 8
#         draw.rectangle(
#             [placeholder_x + shadow_offset, placeholder_y + shadow_offset,
#              placeholder_x + placeholder_width + shadow_offset, 
#              placeholder_y + placeholder_height + shadow_offset],
#             fill=(200, 200, 200)
#         )
        
#         draw.rectangle(
#             [placeholder_x, placeholder_y, 
#              placeholder_x + placeholder_width, placeholder_y + placeholder_height],
#             fill=(245, 250, 255),
#             outline=self.accent_color,
#             width=5
#         )
        
#         # Draw grid pattern
#         grid_spacing = 50
#         for i in range(placeholder_x, placeholder_x + placeholder_width, grid_spacing):
#             draw.line([(i, placeholder_y), (i, placeholder_y + placeholder_height)], 
#                      fill=(230, 240, 250), width=1)
#         for i in range(placeholder_y, placeholder_y + placeholder_height, grid_spacing):
#             draw.line([(placeholder_x, i), (placeholder_x + placeholder_width, i)], 
#                      fill=(230, 240, 250), width=1)
        
#         # Draw "Animation" text in center
#         placeholder_text = "🎬 Animation"
        
#         try:
#             bbox = draw.textbbox((0, 0), placeholder_text, font=title_font)
#             text_width = bbox[2] - bbox[0]
#             text_height = bbox[3] - bbox[1]
#         except:
#             text_width = len(placeholder_text) * 40
#             text_height = 76
        
#         text_x = placeholder_x + (placeholder_width - text_width) // 2
#         text_y = placeholder_y + (placeholder_height - text_height) // 2
#         draw.text((text_x, text_y), placeholder_text, font=title_font, fill=self.accent_color)
        
#         # Draw content on LEFT side with overflow protection
#         content_y = 250
#         content_lines = content.split('\n')
        
#         text_left_margin = 100
#         text_max_width = 850
#         max_y = self.height - 100
        
#         for line in content_lines:
#             if line.strip():
#                 if content_y > max_y:
#                     print(f"   ⚠️ Content overflow on slide {slide_number}")
#                     break
                
#                 clean_line = line.strip().lstrip('-• ').strip()
#                 is_bullet = line.strip().startswith(('-', '•'))
                
#                 wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
#                 for wrapped in wrapped_lines:
#                     if content_y > max_y:
#                         break
                    
#                     if is_bullet:
#                         draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
#                         draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
#                         is_bullet = False
#                     else:
#                         draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
#                     try:
#                         bbox = draw.textbbox((0, 0), wrapped, font=content_font)
#                         line_height = bbox[3] - bbox[1]
#                     except:
#                         line_height = 56
                    
#                     content_y += line_height + 22
        
#         # Draw footer
#         draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
#         slide_num_text = f"Slide {slide_number}"
#         draw.text((100, self.height - 50), slide_num_text, 
#                  font=small_font, fill=self.accent_color)
        
#         topic_name = self.sanitize_filename(topic, max_length=30)
#         slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}_base.png"
#         img.save(slide_path, quality=95)
        
#         print(f"   ✅ Created animation placeholder slide: {slide_path.name}")
#         return str(slide_path)
from PIL import Image, ImageDraw, ImageFont
import textwrap
from pathlib import Path
from config import Config
import os
import re


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
        invalid_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*', "'", '!']
        for char in invalid_chars:
            text = text.replace(char, '')
        text = text.replace(' ', '_')
        return text
    
    @staticmethod
    def clean_markdown(text: str) -> str:
        """Remove markdown formatting from text"""
        text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
        text = re.sub(r'\*(.+?)\*', r'\1', text)
        text = re.sub(r'__(.+?)__', r'\1', text)
        text = re.sub(r'_(.+?)_', r'\1', text)
        return text
    
    def get_fonts(self):
        """Get fonts with proper fallback for Windows/Linux/Mac"""
        try:
            if os.name == 'nt':  # Windows
                title_font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 78)
                content_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 46)
                small_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 36)
            elif os.path.exists("/usr/share/fonts/truetype/dejavu"):  # Linux
                title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 78)
                content_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 46)
                small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
            else:  # Mac or other
                title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 78)
                content_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 46)
                small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
        except Exception as e:
            print(f"⚠️ Could not load system fonts: {e}")
            print("   Using PIL default font")
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
            
            try:
                width = draw.textlength(test_line, font=font)
            except AttributeError:
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
        
        return lines if lines else [text]
    
    def resize_image_to_fit(self, image: Image.Image, target_width: int, target_height: int) -> Image.Image:
        """Resize image to FILL the target area while maintaining aspect ratio"""
        img_ratio = image.width / image.height
        target_ratio = target_width / target_height
        
        if img_ratio > target_ratio:
            # Image is wider - fit to height
            new_height = target_height
            new_width = int(new_height * img_ratio)
        else:
            # Image is taller - fit to width
            new_width = target_width
            new_height = int(new_width / img_ratio)
        
        # Resize image
        resized = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Crop to exact size (center crop)
        left = (new_width - target_width) // 2
        top = (new_height - target_height) // 2
        right = left + target_width
        bottom = top + target_height
        
        return resized.crop((left, top, right, bottom))
    
    def create_text_slide(self, title: str, content: str, slide_number: int, topic: str) -> str:
        """Create a professional text-only slide image with FULL WIDTH text"""
        
        # Clean markdown
        title = self.clean_markdown(title)
        content = self.clean_markdown(content)
        
        img = Image.new('RGB', (self.width, self.height), self.bg_color)
        draw = ImageDraw.Draw(img)
        
        title_font, content_font, small_font = self.get_fonts()
        
        # Draw top accent bar
        draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        draw.rectangle([15, 20, self.width, 280], fill=(240, 247, 255))
        
        # Draw title with dynamic wrapping
        title_y = 70
        max_title_width = self.width - 200
        
        title_lines = self.wrap_text_dynamic(title, title_font, max_title_width, draw)
        
        for line in title_lines:
            try:
                bbox = draw.textbbox((0, 0), line, font=title_font)
                line_width = bbox[2] - bbox[0]
                line_height = bbox[3] - bbox[1]
            except:
                line_width = len(line) * 38
                line_height = 78
            
            line_x = (self.width - line_width) // 2
            draw.text((line_x, title_y), line, font=title_font, fill=self.title_color)
            title_y += line_height + 10
        
        # Draw separator line
        draw.rectangle([80, 280, self.width - 80, 285], fill=self.accent_color)
        
        # Draw content with overflow protection
        content_y = 340
        content_lines = content.split('\n')
        
        text_left_margin = 120
        text_right_margin = 120
        max_text_width = self.width - text_left_margin - text_right_margin
        max_y = self.height - 130  # Stop well before footer
        
        for line in content_lines:
            if line.strip():
                if content_y > max_y:
                    print(f"   ⚠️ Content overflow on slide {slide_number}, truncating...")
                    break
                
                clean_line = line.strip().lstrip('-• ').strip()
                is_bullet = line.strip().startswith(('-', '•'))
                
                wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, max_text_width, draw)
                
                for wrapped in wrapped_lines:
                    if content_y > max_y:
                        break
                    
                    if is_bullet:
                        draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
                        draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
                        is_bullet = False
                    else:
                        draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
                    try:
                        bbox = draw.textbbox((0, 0), wrapped, font=content_font)
                        line_height = bbox[3] - bbox[1]
                    except:
                        line_height = 54
                    
                    content_y += line_height + 24
        
        # Draw footer
        draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
        slide_num_text = f"Slide {slide_number}"
        draw.text((self.width - 280, self.height - 50), slide_num_text, 
                 font=small_font, fill=self.accent_color)
        
        topic_name = self.sanitize_filename(topic, max_length=30)
        slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
        img.save(slide_path, quality=95)
        
        print(f"   ✅ Created text slide: {slide_path.name}")
        return str(slide_path)
    
    def create_slide_with_image(self, title: str, content: str, image_path: str, 
                                slide_number: int, topic: str) -> str:
        """Create a professional slide with text LEFT and image RIGHT (FILLS placeholder)"""
        
        # Clean markdown
        title = self.clean_markdown(title)
        content = self.clean_markdown(content)
        
        img = Image.new('RGB', (self.width, self.height), self.bg_color)
        draw = ImageDraw.Draw(img)
        
        title_font, content_font, small_font = self.get_fonts()
        
        # Draw top accent bar
        draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
        # Draw title with dynamic wrapping
        title_y = 55
        max_title_width = self.width - 200
        
        title_lines = self.wrap_text_dynamic(title, title_font, max_title_width, draw)
        
        for line in title_lines:
            try:
                bbox = draw.textbbox((0, 0), line, font=title_font)
                line_width = bbox[2] - bbox[0]
                line_height = bbox[3] - bbox[1]
            except:
                line_width = len(line) * 38
                line_height = 78
            
            line_x = (self.width - line_width) // 2
            draw.text((line_x, title_y), line, font=title_font, fill=self.title_color)
            title_y += line_height + 8
        
        # Draw separator line
        draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
        # Image placeholder dimensions
        img_x = self.width - 850 - 60  # 1010
        img_y = 250
        img_width = 850
        img_height = 700
        
        # Load and paste image - FILL entire placeholder
        try:
            slide_img = Image.open(image_path)
            
            # Resize to FILL the entire placeholder (no gray bars)
            slide_img_fitted = self.resize_image_to_fit(slide_img, img_width, img_height)
            
            # Draw shadow
            shadow_offset = 8
            draw.rectangle(
                [img_x + shadow_offset, img_y + shadow_offset, 
                 img_x + img_width + shadow_offset, img_y + img_height + shadow_offset],
                fill=(200, 200, 200)
            )
            
            # Draw border
            draw.rectangle(
                [img_x - 5, img_y - 5, img_x + img_width + 5, img_y + img_height + 5],
                outline=self.accent_color,
                width=5
            )
            
            # Paste fitted image
            img.paste(slide_img_fitted, (img_x, img_y))
            print(f"   🖼️ Added image (fitted): {Path(image_path).name}")
        except Exception as e:
            print(f"   ⚠️ Error loading image: {e}")
        
        # Draw content on LEFT side with overflow protection
        content_y = 235
        content_lines = content.split('\n')
        
        text_left_margin = 100
        text_max_width = 820  # Slightly reduced for better spacing
        max_y = self.height - 110  # Stop before footer
        
        for line in content_lines:
            if line.strip():
                if content_y > max_y:
                    print(f"   ⚠️ Content overflow on slide {slide_number}")
                    break
                
                clean_line = line.strip().lstrip('-• ').strip()
                is_bullet = line.strip().startswith(('-', '•'))
                
                wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
                for wrapped in wrapped_lines:
                    if content_y > max_y:
                        break
                    
                    if is_bullet:
                        draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
                        draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
                        is_bullet = False
                    else:
                        draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
                    try:
                        bbox = draw.textbbox((0, 0), wrapped, font=content_font)
                        line_height = bbox[3] - bbox[1]
                    except:
                        line_height = 54
                    
                    content_y += line_height + 20  # Tighter spacing
        
        # Draw footer
        draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
        slide_num_text = f"Slide {slide_number}"
        draw.text((100, self.height - 50), slide_num_text, 
                 font=small_font, fill=self.accent_color)
        
        topic_name = self.sanitize_filename(topic, max_length=30)
        slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}.png"
        img.save(slide_path, quality=95)
        
        print(f"   ✅ Created image slide: {slide_path.name}")
        return str(slide_path)
    
    def create_slide_with_animation_placeholder(self, title: str, content: str, 
                                                slide_number: int, topic: str) -> str:
        """Create a professional slide with text LEFT and animation placeholder RIGHT"""
        
        # Clean markdown
        title = self.clean_markdown(title)
        content = self.clean_markdown(content)
        
        img = Image.new('RGB', (self.width, self.height), self.bg_color)
        draw = ImageDraw.Draw(img)
        
        title_font, content_font, small_font = self.get_fonts()
        
        # Draw top accent bar
        draw.rectangle([0, 0, self.width, 20], fill=self.accent_color)
        draw.rectangle([0, 20, 15, self.height], fill=self.accent_color)
        draw.rectangle([15, 20, self.width, 200], fill=(240, 247, 255))
        
        # Draw title with dynamic wrapping
        title_y = 55
        max_title_width = self.width - 200
        
        title_lines = self.wrap_text_dynamic(title, title_font, max_title_width, draw)
        
        for line in title_lines:
            try:
                bbox = draw.textbbox((0, 0), line, font=title_font)
                line_width = bbox[2] - bbox[0]
                line_height = bbox[3] - bbox[1]
            except:
                line_width = len(line) * 38
                line_height = 78
            
            line_x = (self.width - line_width) // 2
            draw.text((line_x, title_y), line, font=title_font, fill=self.title_color)
            title_y += line_height + 8
        
        # Draw separator line
        draw.rectangle([80, 200, self.width - 80, 205], fill=self.accent_color)
        
        # Draw placeholder box on right side
        placeholder_x = self.width - 850 - 60  # 1010
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
        
        # Draw placeholder background
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
        
        try:
            bbox = draw.textbbox((0, 0), placeholder_text, font=title_font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
        except:
            text_width = len(placeholder_text) * 38
            text_height = 78
        
        text_x = placeholder_x + (placeholder_width - text_width) // 2
        text_y = placeholder_y + (placeholder_height - text_height) // 2
        draw.text((text_x, text_y), placeholder_text, font=title_font, fill=self.accent_color)
        
        # Draw content on LEFT side with overflow protection
        content_y = 235
        content_lines = content.split('\n')
        
        text_left_margin = 100
        text_max_width = 820
        max_y = self.height - 110
        
        for line in content_lines:
            if line.strip():
                if content_y > max_y:
                    print(f"   ⚠️ Content overflow on slide {slide_number}")
                    break
                
                clean_line = line.strip().lstrip('-• ').strip()
                is_bullet = line.strip().startswith(('-', '•'))
                
                wrapped_lines = self.wrap_text_dynamic(clean_line, content_font, text_max_width, draw)
                
                for wrapped in wrapped_lines:
                    if content_y > max_y:
                        break
                    
                    if is_bullet:
                        draw.text((text_left_margin, content_y), "•", font=content_font, fill=self.accent_color)
                        draw.text((text_left_margin + 60, content_y), wrapped, font=content_font, fill=self.text_color)
                        is_bullet = False
                    else:
                        draw.text((text_left_margin, content_y), wrapped, font=content_font, fill=self.text_color)
                    
                    try:
                        bbox = draw.textbbox((0, 0), wrapped, font=content_font)
                        line_height = bbox[3] - bbox[1]
                    except:
                        line_height = 54
                    
                    content_y += line_height + 20
        
        # Draw footer
        draw.rectangle([0, self.height - 60, self.width, self.height], fill=(240, 247, 255))
        slide_num_text = f"Slide {slide_number}"
        draw.text((100, self.height - 50), slide_num_text, 
                 font=small_font, fill=self.accent_color)
        
        topic_name = self.sanitize_filename(topic, max_length=30)
        slide_path = Config.SLIDES_DIR / f"{topic_name}_slide_{slide_number}_base.png"
        img.save(slide_path, quality=95)
        
        print(f"   ✅ Created animation placeholder slide: {slide_path.name}")
        return str(slide_path)
