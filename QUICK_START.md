# Quick Start Guide

## Prerequisites
- Python 3.8+
- Node.js 16+
- FFmpeg
- LaTeX (for Manim)

## Installation

### Quick Setup (Automated)
```bash
cd combined_system
./setup.sh
```

### Start Application
```bash
./start.sh
```

Access at: http://localhost:5173

## Manual Setup

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create and configure .env
cp .env.example .env
# Edit .env with your API keys

# Run
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Keys Needed

Add these to `backend/.env`:

```env
GEMINI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
UNSPLASH_ACCESS_KEY=your_key_here
```

### Get API Keys:
- **Gemini**: https://makersuite.google.com/app/apikey
- **ElevenLabs**: https://elevenlabs.io/
- **Unsplash**: https://unsplash.com/developers

## Usage Flow

1. **Enter Topic**: "Explain Newton's Second Law with examples"
2. **Configure**:
   - Slides: 3-10
   - Language: English/Hindi/Kannada/Telugu
   - Tone: Formal/Casual/Storytelling
3. **Generate**: Wait 2-5 minutes
4. **View/Download**: Watch video and download

## API Endpoints

### Backend (Port 8000)
- `POST /api/generate` - Generate video presentation
- `GET /api/status/{id}` - Check generation status
- `GET /api/video/{filename}` - Download video
- `GET /api/content/{id}` - Get slide content
- `GET /api/script/{id}` - Get narration script
- `GET /health` - Health check

### Frontend (Port 5173)
- Home page with input form
- Video player with timeline

## File Structure

```
combined_system/
├── backend/
│   ├── generators/
│   │   ├── content_generator.py    # Slide structure
│   │   ├── script_generator.py     # Narration scripts
│   │   ├── manim_generator.py      # Animation code
│   │   ├── voice_generator.py      # Audio synthesis
│   │   └── image_fetcher.py        # Image downloads
│   ├── utils/
│   │   ├── video_renderer.py       # Manim rendering
│   │   └── video_composer.py       # Video assembly
│   ├── outputs/                    # Generated files
│   ├── app.py                      # Main API
│   ├── config.py                   # Configuration
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Home.jsx            # Input form
│       │   └── VideoPlayer.jsx     # Video viewer
│       └── App.jsx
└── README.md
```

## Common Issues

### "Module not found" (Backend)
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "Cannot connect to backend" (Frontend)
- Ensure backend is running on port 8000
- Check `http://localhost:8000/health`

### "Manim rendering failed"
- Install LaTeX: `sudo apt-get install texlive texlive-latex-extra`
- Install Cairo: `sudo apt-get install libcairo2-dev`

### "API key invalid"
- Check `.env` file has correct keys
- No quotes around keys
- No spaces around `=`

## Development

### Adding New Features

**New Animation Template**:
```python
# In backend/generators/manim_generator.py
def generate_template_animation(self, template_type, data):
    # Add custom animation templates
```

**New Language**:
```python
# In backend/config.py
VOICE_MAP = {
    "your_language": "voice_id_here"
}
```

### Testing
```bash
# Backend
cd backend
pytest

# Frontend  
cd frontend
npm test
```

## Production Deployment

### Backend (Gunicorn)
```bash
cd backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app
```

### Frontend (Build)
```bash
cd frontend
npm run build
# Serve dist/ folder with nginx or similar
```

## Performance Tips

1. **Parallel Processing**: Multiple slides can be generated in parallel
2. **Caching**: Cache generated animations for similar topics
3. **Queue System**: Use Celery for async video generation
4. **CDN**: Serve videos from CDN for faster delivery

## Monitoring

Check logs:
```bash
# Backend logs
cd backend
tail -f logs/app.log

# Frontend dev logs
cd frontend
npm run dev
```

## Support

For issues:
1. Check logs
2. Verify API keys
3. Test endpoints with curl
4. Review MIGRATION_NOTES.md

## Next Steps

- [ ] Set up API keys
- [ ] Run `./setup.sh`
- [ ] Run `./start.sh`
- [ ] Generate your first video!

---

**Happy Creating! 🎬🎨🎤**
