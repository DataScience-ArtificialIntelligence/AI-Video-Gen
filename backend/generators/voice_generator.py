import requests
from config import Config
from typing import Dict
import json

class VoiceGenerator:
    """Generate voice narration audio for slides using Sarvam AI"""
    
    def __init__(self):
        self.api_key = Config.SARVAM_API_KEY
        self.api_url = Config.SARVAM_TTS_URL
    
    def generate_voice_for_slide(self, narration_text: str, slide_number: int, 
                                  topic: str, language: str = "english") -> str:
        """Generate voice audio for a single slide"""
        
        # Get speaker for language
        speaker = Config.SARVAM_SPEAKER_MAP.get(language.lower(), "anushka")
        
        # Prepare request
        headers = {
            "Content-Type": "application/json",
            "API-Subscription-Key": self.api_key
        }
        
        payload = {
            "inputs": [narration_text[:500]],  # Limit to 500 characters
            "target_language_code": self._get_language_code(language),
            "speaker": speaker,
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.5,
            "speech_sample_rate": 22050,
            "enable_preprocessing": True,
            "model": Config.SARVAM_MODEL
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            
            # Get audio data
            result = response.json()
            
            if "audios" in result and len(result["audios"]) > 0:
                # Sarvam returns base64 encoded audio
                import base64
                audio_data = base64.b64decode(result["audios"][0])
                
                # Save audio
                topic_name = topic[:30].replace(' ', '_')
                audio_filename = f"{topic_name}_slide_{slide_number}.wav"
                audio_path = Config.AUDIO_DIR / audio_filename
                
                with open(audio_path, 'wb') as f:
                    f.write(audio_data)
                
                return str(audio_path)
            else:
                raise Exception("No audio generated in response")
                
        except Exception as e:
            print(f"Sarvam AI TTS Error: {e}")
            raise
    
    def generate_complete_audio(self, script_data: Dict, language: str = "english") -> str:
        """Generate complete audio for all slides combined"""
        
        # Combine all narration texts
        full_text = " ".join([
            slide_script['narration_text'] 
            for slide_script in script_data['slide_scripts']
        ])
        
        # Split text into chunks of max 500 characters
        chunks = self._split_text_into_chunks(full_text, max_length=500)
        print(f"Split text into {len(chunks)} chunks for TTS generation")
        
        # Get speaker for language
        speaker = Config.SARVAM_SPEAKER_MAP.get(language.lower(), "anushka")
        
        # Prepare request
        headers = {
            "Content-Type": "application/json",
            "API-Subscription-Key": self.api_key
        }
        
        all_audio_data = []
        
        for i, chunk in enumerate(chunks):
            payload = {
                "inputs": [chunk],
                "target_language_code": self._get_language_code(language),
                "speaker": speaker,
                "pitch": 0,
                "pace": 1.0,
                "loudness": 1.5,
                "speech_sample_rate": 22050,
                "enable_preprocessing": True,
                "model": Config.SARVAM_MODEL
            }
            
            print(f"Generating audio chunk {i+1}/{len(chunks)}...")
            
            try:
                response = requests.post(self.api_url, headers=headers, json=payload)
                if response.status_code != 200:
                    print(f"Sarvam API Error Response: {response.text}")
                    print(f"Request payload: {json.dumps(payload, indent=2)}")
                response.raise_for_status()
                
                # Get audio data
                result = response.json()
                
                if "audios" in result and len(result["audios"]) > 0:
                    # Sarvam returns base64 encoded audio
                    import base64
                    audio_data = base64.b64decode(result["audios"][0])
                    all_audio_data.append(audio_data)
                else:
                    raise Exception("No audio generated in response")
                    
            except Exception as e:
                print(f"Sarvam AI TTS Error on chunk {i+1}: {e}")
                raise
        
        # Combine all audio chunks
        combined_audio = b''.join(all_audio_data)
        
        # Save complete audio
        topic_name = script_data['topic'][:30].replace(' ', '_')
        audio_path = Config.AUDIO_DIR / f"{topic_name}_complete.wav"
        
        with open(audio_path, 'wb') as f:
            f.write(combined_audio)
        
        print(f"Complete audio saved to: {audio_path}")
        return str(audio_path)
    
    def _get_language_code(self, language: str) -> str:
        """Map language name to Sarvam AI language code"""
        language_map = {
            "english": "en-IN",
            "hindi": "hi-IN",
            "kannada": "kn-IN",
            "telugu": "te-IN",
            "tamil": "ta-IN",
            "bengali": "bn-IN",
            "gujarati": "gu-IN",
            "malayalam": "ml-IN",
            "marathi": "mr-IN",
            "odia": "or-IN",
            "punjabi": "pa-IN"
        }
        return language_map.get(language.lower(), "en-IN")
    
    def _split_text_into_chunks(self, text: str, max_length: int = 500) -> list:
        """Split text into chunks respecting sentence boundaries"""
        if len(text) <= max_length:
            return [text]
        
        chunks = []
        sentences = text.replace('!', '.').replace('?', '.').split('.')
        current_chunk = ""
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            # If adding this sentence would exceed limit, save current chunk
            if len(current_chunk) + len(sentence) + 2 > max_length:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence + ". "
            else:
                current_chunk += sentence + ". "
        
        # Add remaining text
        if current_chunk.strip():
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def combine_slide_audios(self, slide_audio_paths: dict, topic: str) -> str:
        """Combine individual slide audio files into one complete audio"""
        from moviepy import AudioFileClip, concatenate_audioclips
        from pathlib import Path
        
        # Load all audio clips in order
        audio_clips = []
        for slide_num in sorted(slide_audio_paths.keys()):
            audio_path = slide_audio_paths[slide_num]
            if Path(audio_path).exists():
                clip = AudioFileClip(audio_path)
                audio_clips.append(clip)
        
        if not audio_clips:
            raise Exception("No audio clips to combine")
        
        # Concatenate all clips
        final_audio = concatenate_audioclips(audio_clips)
        
        # Save combined audio
        topic_name = topic[:30].replace(' ', '_')
        output_path = Config.AUDIO_DIR / f"{topic_name}_complete.wav"
        final_audio.write_audiofile(str(output_path), codec='pcm_s16le')
        
        # Clean up
        for clip in audio_clips:
            clip.close()
        final_audio.close()
        
        print(f"Combined {len(audio_clips)} audio clips into: {output_path}")
        return str(output_path)
