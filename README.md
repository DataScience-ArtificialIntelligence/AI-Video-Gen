# Combined Video Presentation Generator

An AI-powered system that generates educational video presentations with dynamic slides, manim animations, images, and voice narration.

## Features

- 🎨 **Dynamic Manim Animations**: Automatically generates animations for mathematical, physics, and scientific concepts
- 🖼️ **Smart Image Integration**: Fetches relevant images from Unsplash based on slide content
- 🎤 **AI Voice Narration**: Multi-language voice generation with ElevenLabs
- 📊 **Intelligent Slide Generation**: AI creates structured presentation content
- ⏱️ **Timestamp Synchronization**: Perfect sync between slides, animations, and narration
- 🌐 **Multi-language Support**: English, Hindi, Kannada, Telugu

## Architecture

```
combined_system/
├── backend/          # Python FastAPI backend
│   ├── generators/   # Content, script, animation, voice generators
│   ├── utils/        # Video rendering and composition
│   ├── outputs/      # Generated files
│   └── app.py        # Main API server
└── frontend/         # React frontend
    └── src/
        └── components/  # UI components
```

## Setup

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd combined_system/backend
   ```

2. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Linux/Mac
   # or
   venv\Scripts\activate  # On Windows
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Manim dependencies**:
   ```bash
   # On Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install -y ffmpeg libcairo2-dev libpango1.0-dev texlive texlive-latex-extra
   
   # On macOS
   brew install ffmpeg cairo pango
   brew install --cask mactex
   ```

5. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```

6. **Add your API keys to `.env`**:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

7. **Run the backend**:
   ```bash
   python app.py
   ```
   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd combined_system/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the frontend**:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## API Keys Required

- **Google Gemini API**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **ElevenLabs API**: Get from [ElevenLabs](https://elevenlabs.io/)
- **Unsplash API**: Get from [Unsplash Developers](https://unsplash.com/developers)

## Usage

1. Open `http://localhost:5173` in your browser
2. Enter a topic/prompt (e.g., "Explain Newton's Second Law of Motion")
3. Configure:
   - Number of slides (3-10)
   - Language (English, Hindi, Kannada, Telugu)
   - Tone (Formal, Casual, Storytelling)
4. Click "Generate Video Presentation"
5. Wait for the generation process (may take 2-5 minutes)
6. View and download your generated video

## How It Works

1. **Content Generation**: AI analyzes the prompt and creates structured slide content
2. **Script Generation**: Generates narration scripts with precise timestamps for each slide
3. **Voice Generation**: Creates audio narration in the selected language
4. **Animation Generation**: For slides needing dynamic content, generates and renders Manim animations
5. **Image Fetching**: Downloads relevant images from Unsplash for static content
6. **Video Composition**: Combines all elements (animations, images, audio) into final video

## Technical Stack

### Backend
- FastAPI (Web framework)
- Google Gemini (AI content generation)
- ElevenLabs (Voice synthesis)
- Manim Community Edition (Animation rendering)
- MoviePy (Video composition)
- Pydantic (Data validation)

### Frontend
- React 19
- Vite (Build tool)
- Tailwind CSS (Styling)
- Axios (HTTP client)

## Project Structure

### Backend Generators
- `content_generator.py`: Generates presentation structure
- `script_generator.py`: Creates narration scripts with timestamps
- `manim_generator.py`: Generates Manim animation code
- `voice_generator.py`: Synthesizes voice narration
- `image_fetcher.py`: Fetches relevant images

### Backend Utils
- `video_renderer.py`: Renders Manim animations
- `video_composer.py`: Combines all media into final video

## Troubleshooting

### Backend Issues

**Manim rendering fails**:
- Ensure all Manim dependencies are installed
- Check if LaTeX is properly installed (`which latex`)
- Try running a simple manim example first

**API errors**:
- Verify all API keys are correctly set in `.env`
- Check API quotas and limits
- Ensure internet connectivity

**Import errors**:
- Activate virtual environment
- Reinstall requirements: `pip install -r requirements.txt --force-reinstall`

### Frontend Issues

**Connection refused**:
- Ensure backend is running on port 8000
- Check CORS settings in backend

**Build errors**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm run dev -- --force`

## Future Enhancements

- [ ] Real-time progress tracking with WebSockets
- [ ] Video editing capabilities
- [ ] More animation templates
- [ ] Custom voice training
- [ ] Slide templates and themes
- [ ] Export to multiple formats (MP4, PPT, PDF)
- [ ] Collaborative editing
- [ ] Cloud storage integration

## License

MIT

## Contributors

Built by combining manim_video and vp projects into a unified system.
