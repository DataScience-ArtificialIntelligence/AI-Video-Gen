# Video Presentation Generator - Frontend

React-based frontend for the AI Video Presentation Generator system.

## Features

- 🎨 **Modern UI**: Clean, gradient-based interface with Tailwind CSS
- ⚡ **Fast Development**: Vite for instant HMR and fast builds
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎬 **Video Player**: Built-in video player with slide timeline
- 📊 **Progress Tracking**: Real-time generation progress display

## Tech Stack

- **React 19**: Latest React with concurrent features
- **Vite 7**: Next-generation frontend tooling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Axios**: HTTP client for API requests

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/
│   ├── Home.jsx          # Main input form
│   └── VideoPlayer.jsx   # Video playback with timeline
├── App.jsx               # Main app component
├── App.css               # App-level styles
├── index.css             # Global styles & Tailwind
└── main.jsx              # Entry point
```

## Components

### Home.jsx
Main interface for video generation:
- Topic/prompt input
- Number of slides selector (3-10)
- Language selection (English, Hindi, Kannada, Telugu)
- Tone selection (Formal, Casual, Enthusiastic)
- Real-time progress tracking
- Error handling

### VideoPlayer.jsx
Video playback interface:
- Video player with controls
- Slide timeline with timestamps
- Slide content display
- Media type indicators (animation/image badges)
- Back to home navigation

## API Integration

Connects to backend API at `http://localhost:8000`:

**POST /api/generate**
```json
{
  "topic": "Explain Newton's Third Law",
  "num_slides": 5,
  "language": "english",
  "tone": "formal"
}
```

**Response:**
```json
{
  "status": "success",
  "content_data": { /* slide structure */ },
  "script_data": { /* narration scripts */ },
  "video_path": "/path/to/video.mp4"
}
```

**GET /api/video/{filename}**
- Streams generated video file

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment

Backend API URL is hardcoded to `http://localhost:8000`.
To change, update in `src/components/Home.jsx`:
```javascript
const response = await axios.post("http://localhost:8000/api/generate", {
  // ...
});
```

## Styling

Uses Tailwind CSS for styling:
- Gradient backgrounds
- Responsive grid layouts
- Hover effects and transitions
- Loading animations
- Custom animations for spinners

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES2020+ support
- Video playback requires HTML5 video support

## Troubleshooting

**Port already in use**:
- Vite will automatically try next available port (5174, 5175, etc.)
- Or specify port: `npm run dev -- --port 3000`

**API connection refused**:
- Ensure backend is running on port 8000
- Check CORS settings in backend

**Build errors**:
- Clear cache: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`

