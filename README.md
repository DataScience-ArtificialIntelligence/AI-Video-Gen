<div align="center">

# 🎬 AI-Lecture-Generator

**Transform any topic into an engaging video presentation with AI-powered content, narration, and visuals.**

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://www.python.org/)


### 👨‍💻 Built by

<table>
<tr>
<td align="center"><b>Kamal Nayan Kumar</b><br/>Roll No: 23BDS026</td>
<td align="center"><b>Vijaypal Singh Rathore</b><br/>Roll No: 23BDS067</td>
</tr>
<tr>
<td align="center"><b>Rahul Patel</b><br/>Roll No: 23BDS047</td>
<td align="center"><b>Om Pandey</b><br/>Roll No: 23BDS40</td>
</tr>
</table>

*🎓 DSAI Students @ IIIT Dharwad*


</div>

---

## ✨ Features

- 🤖 **AI-Powered Content:** Uses **Gemini AI** to generate structured presentation content
- 🎤 **Multi-Language TTS:** Voice narration (English, Hindi, Kannada, Telugu) via **Sarvam AI**
- 🎨 **Smart Visuals:** Fetches images from **Unsplash** or generates animations via **Manim**
- 🎞️ **Professional Videos:** Uses **FFmpeg** for synchronized video composition
- 📊 **Interactive Timeline:** Navigate video slides easily
- 🎯 **Mutual Exclusivity:** Each slide is either **text**, **image**, or **animation** (never both)
- 📥 **Download Ready:** Export final video as MP4

---

## 🏗️ Architecture Overview

```
Frontend (React) → API (FastAPI) → Backend Pipeline → External APIs → Output
                                         ↓
                    Gemini AI → Sarvam AI → Unsplash → Manim → FFmpeg → Final MP4
```

**Flow:**  
`User Input → Content → Script → Audio → Visuals → Video Composition → Streaming`

---

## 📋 Prerequisites

- **Python:** 3.10 or higher
- **Node.js:** 18.0 or higher
- **FFmpeg:** Installed and added to PATH
- **Manim:** Community Edition
- **API Keys:**
  - Google Gemini
  - Sarvam AI
  - Unsplash

---

## 🚀 Installation (Step-by-Step)

### 1️⃣ Clone Repository

```
git clone https://github.com/yourusername/ai-video-presentation-generator.git
cd ai-video-presentation-generator
```

### 2️⃣ System Dependencies

#### Install FFmpeg

**macOS:**
```
brew install ffmpeg
```

**Ubuntu/Debian:**
```
sudo apt-get update
sudo apt-get install -y ffmpeg
```

**Windows:**
- Download from: [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
- Add `ffmpeg/bin` to your PATH

#### Install Manim

```
pip install manim
```

### 3️⃣ Backend Setup

```
cd backend
python -m venv venv
```

**Activate virtual environment:**

**macOS/Linux:**
```
source venv/bin/activate
```

**Windows (PowerShell):**
```
venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```
venv\Scripts\activate
```

**Install dependencies:**
```
pip install -r requirements.txt
```

**Create `.env` file inside `backend/`:**

```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro

SARVAM_API_KEY=your_sarvam_api_key_here
SARVAM_TTS_URL=https://api.sarvam.ai/text-to-speech
SARVAM_MODEL=bulbul:v1

UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

HOST=0.0.0.0
PORT=8000
```

**Get API Keys:**
- **Gemini:** [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Sarvam AI:** [Sarvam Console](https://www.sarvam.ai/)
- **Unsplash:** [Unsplash Developers](https://unsplash.com/developers)

**Run backend:**
```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend runs on `http://localhost:8000`

### 4️⃣ Frontend Setup

```
cd ../frontend
npm install
npm run dev
```

✅ Frontend runs on `http://localhost:5173`

---

## 🧠 Usage

1. **Open browser** → `http://localhost:5173`
2. **Enter details:**
   - Topic (e.g., "Explain Newton's Laws of Motion")
   - Number of slides (3–10)
   - Language (English/Hindi/Kannada/Telugu)
   - Tone (Formal/Casual/Enthusiastic)
3. **Click Generate**
4. **Wait (2–5 mins)** → Watch, navigate slides, and Download MP4

---

## 📁 Project Structure

```
ai-video-presentation-generator/
├── frontend/                 # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   └── CanvasAnimation.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # FastAPI backend
│   ├── generators/
│   │   ├── content_generator.py
│   │   ├── script_generator.py
│   │   ├── voice_generator.py
│   │   ├── manim_generator.py
│   │   └── image_fetcher.py
│   ├── utils/
│   │   ├── video_renderer.py
│   │   ├── slide_renderer.py
│   │   └── video_composer.py
│   ├── main.py
│   ├── config.py
│   ├── requirements.txt
│   └── .env
│
├── output/                   # Generated files (ignored in .git)
│   ├── slides/
│   ├── scripts/
│   ├── audio/
│   ├── images/
│   ├── manim_code/
│   ├── manim_output/
│   └── final/
│
├── docs/
│   └── demo.mp4
│
└── README.md
```

---

## 🔧 Configuration (Backend)

**`config.py`:**

```
import os
from pathlib import Path

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")
    SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
    SARVAM_TTS_URL = os.getenv("SARVAM_TTS_URL")
    SARVAM_MODEL = os.getenv("SARVAM_MODEL", "bulbul:v1")
    UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

    OUTPUT_DIR = Path(__file__).parent / "output"
    SLIDES_DIR = OUTPUT_DIR / "slides"
    SCRIPTS_DIR = OUTPUT_DIR / "scripts"
    AUDIO_DIR = OUTPUT_DIR / "audio"
    IMAGES_DIR = OUTPUT_DIR / "images"
    MANIM_CODE_DIR = OUTPUT_DIR / "manim_code"
    MANIM_OUTPUT_DIR = OUTPUT_DIR / "manim_output"
    FINAL_DIR = OUTPUT_DIR / "final"
```

---

## 🎯 API Endpoints

### `POST /api/generate`

Generate a video presentation.

**Request:**
```
{
  "topic": "Explain Newton's Third Law",
  "num_slides": 5,
  "language": "english",
  "tone": "formal"
}
```

**Response:**
```
{
  "status": "success",
  "message": "Video generated successfully",
  "video_filename": "video.mp4",
  "video_path": "/output/final/video.mp4"
}
```

### `GET /api/video/{filename}`

Stream generated video with range request support.

### `GET /api/status/{generation_id}`

Get generation progress.

---

## 🛠️ Troubleshooting

### FFmpeg not found

```
ffmpeg -version
```

If missing, install (see installation section).

### Manim rendering fails

```
manim --version
```

Reinstall if necessary:
```
pip install manim
```

### API Key errors

- Ensure `.env` is in `backend/`
- Restart backend after editing keys

### CORS errors

Update `allow_origins` in `backend/main.py`:

```
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🧑‍💻 Development

Run with hot reload:

```
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```

**Follow:**
- Python style: PEP 8 (`black` formatter)
- JS/React: ESLint standard

---

## 🤝 Contributing

1. Fork repo
2. Create branch: `git checkout -b feature/your-feature`
3. Commit & push changes
4. Open Pull Request

---

## 🗺️ Roadmap

- [ ] More animation templates
- [ ] Multilingual
- [ ] Real-time progress updates (SSE)
- [ ] Custom slide templates
- [ ] Cloud deployment guide
- [ ] Docker & CI/CD

---

## 🙏 Acknowledgments

- **Google Gemini** for AI content
- **Sarvam AI** for multilingual TTS
- **Unsplash** for visuals
- **Manim Community** for animations
- **FastAPI** & **React** for framework support

---



**Project Maintainer:** 
-
Vijaypal Singh Rathore
- 📂 **GitHub:** [@Vpbanna123](https://github.com/VPbanna123)

Kamal Nayan Kumar
- 📂 **GitHub:** [@KAMAL NAYAN](https://github.com/Kamal-Nayan-Kumar)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by VPbanna

</div>
```

***

