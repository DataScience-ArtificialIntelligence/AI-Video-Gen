<div align="center">

# AI-Powered Video Presentation Generator: A Multi-Modal Content Synthesis Framework

**Transform any topic into an engaging video presentation with AI-powered content, narration, and visuals.**

</div>

---

## 👥 Team Members

<table>
<tr>
<td align="center"><b>Kamal Nayan Kumar</b><br/>Roll No: 23BDS026</td>
<td align="center"><b>Vijaypal Singh Rathore</b><br/>Roll No: 23BDS067</td>
</tr>
<tr>
<td align="center"><b>Rahul Patel</b><br/>Roll No: 23BDS047</td>
<td align="center"><b>Om Pandey</b><br/>Roll No: 23BDS040</td>
</tr>
</table>

---

## ✨ Features

- 🤖 **AI-Powered Content Generation** using Gemini
- 🎤 **Multi-Language Voice Generation** via Sarvam AI  
- 🎨 **Smart Visuals** using Unsplash or Manim animations  
- 🎞️ Professional video output using **FFmpeg**
- 📊 **Timeline + Slide Navigation**
- 🎯 Each slide is **text OR image OR animation**
- 📥 Export final MP4 video

---

## 📁 Folder Structure

```
AI-VIDEO-GEN/
│
├── backend/
│   ├── generators/
│   │   ├── content_generator.py
│   │   ├── image_fetcher.py
│   │   ├── manim_generator.py
│   │   ├── script_generator.py
│   │   └── voice_generator.py
│   │
│   ├── outputs/
│   │   ├── audio/
│   │   ├── images/
│   │   ├── manim_code/
│   │   ├── manim_output/
│   │   ├── scripts/
│   │   ├── slides/
│   │   └── final/
│   │
│   ├── utils/
│   │   ├── slide_renderer.py
│   │   ├── video_composer.py
│   │   └── video_renderer.py
│   │
│   ├── venv/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── requirements.txt
│   ├── MANIM_CODE_GUIDE.md
│   ├── app.py (FastAPI entry)
│   └── main.py
│
├── express/                 # Node backend (optional)
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── CanvasAnimation.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── SlideEditor.jsx
│   │   │   ├── SlidePreview.jsx
│   │   │   ├── StepProgress.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── hooks/
│   │   │   └── useSSEProgress.jsx
│   │   ├── styles/
│   │   │   └── theme.css
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── pptExport.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation (Windows Only)

### 1️⃣ Clone the Repository

```
git clone https://github.com/yourusername/ai-lecture-generator.git
cd ai-lecture-generator
```

---

## 🛠️ Backend Setup (FastAPI + Python)

### 2️⃣ Create Virtual Environment

```
cd backend
python -m venv venv
venv\Scripts\activate
```

### 3️⃣ Install Dependencies

```
pip install -r requirements.txt
```

### 4️⃣ Install FFmpeg (Windows)

- Download from: https://ffmpeg.org/download.html  
- Extract  
- Add `ffmpeg/bin` directory to **System PATH**

Check installation:

```
ffmpeg -version
```

---

### 5️⃣ Install Manim

```
pip install manim
```

---

### 6️⃣ Add Environment Variables

Create a `.env` inside `backend/`:

```
GEMINI_API_KEY=your_key
SARVAM_API_KEY=your_key
SARVAM_TTS_URL=https://api.sarvam.ai/text-to-speech
SARVAM_MODEL=bulbul:v1
UNSPLASH_ACCESS_KEY=your_key
HOST=0.0.0.0
PORT=8000
```

---

### 7️⃣ Start Backend

```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at:

```
http://localhost:8000
```

---

## 💻 Frontend Setup (React + Vite)

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🧠 How to Use

1. Open frontend in browser  
2. Enter:
   - Topic  
   - No. of slides  
   - Language  
   - Tone  
3. Click **Generate**
4. Wait while:
   - Content is created  
   - Audio is generated  
   - Images/Animation generated  
   - Video composed  
5. Watch and download the final MP4

---

## 🛠️ Troubleshooting

### ❌ FFmpeg not working  
Add `ffmpeg/bin` to PATH and restart terminal.

### ❌ Manim error  
Reinstall:

```
pip install manim
```

### ❌ CORS errors  
Set your correct frontend URL in backend CORS settings.

---

