import requests
from pathlib import Path
from config import Config
import os

class ImageFetcher:
    """Fetch relevant images from Unsplash for slides"""
    
    def __init__(self):
        self.api_key = Config.UNSPLASH_ACCESS_KEY
        self.base_url = "https://api.unsplash.com/search/photos"
    
    def fetch_image(self, keyword: str, slide_number: int, topic: str) -> str:
        """Fetch and save image for a slide"""
        
        try:
            params = {
                "query": keyword,
                "per_page": 1,
                "client_id": self.api_key
            }
            
            response = requests.get(self.base_url, params=params)
            data = response.json()
            
            if response.ok and data.get('results'):
                image_url = data['results'][0]['urls']['regular']
                
                # Download image
                image_response = requests.get(image_url)
                if image_response.ok:
                    # Save image
                    topic_name = topic[:30].replace(' ', '_')
                    image_filename = f"{topic_name}_slide_{slide_number}.jpg"
                    image_path = Config.IMAGES_DIR / image_filename
                    
                    with open(image_path, 'wb') as f:
                        f.write(image_response.content)
                    
                    return str(image_path)
            
            return ""
            
        except Exception as e:
            print(f"Error fetching image: {e}")
            return ""
