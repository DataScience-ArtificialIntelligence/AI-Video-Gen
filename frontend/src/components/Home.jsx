import { useState } from "react";
import axios from "axios";

export default function Home({ onGenerationComplete }) {
  const [topic, setTopic] = useState("");
  const [numSlides, setNumSlides] = useState(5);
  const [language, setLanguage] = useState("english");
  const [tone, setTone] = useState("formal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);
    setStatusMessage("Starting generation...");

    try {
      const response = await axios.post("http://localhost:8000/api/generate", {
        topic,
        num_slides: numSlides,
        language,
        tone
      });

      if (response.data.status === "success") {
        setProgress(100);
        setStatusMessage("Video generated successfully!");

        setTimeout(() => {
          onGenerationComplete({
            content: response.data.content_data,
            script: response.data.script_data,
            videoPath: response.data.video_path
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Generation error:", error);
      setError(
        error.response?.data?.detail ||
        error.message ||
        "Error generating video. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            🎬 AI Video Presentation Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Create educational videos with PPT slides, animations, and voice narration
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">❌ {error}</p>
            </div>
          )}

          {statusMessage && !error && (
            <div className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">ℹ️ {statusMessage}</p>
              {loading && (
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Topic / Prompt
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Explain Newton's Third Law of Motion"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📊 Number of Slides
              </label>
              <input
                type="number"
                value={numSlides}
                onChange={(e) => setNumSlides(parseInt(e.target.value) || 5)}
                min="3"
                max="10"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🌐 Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                disabled={loading}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="kannada">Kannada</option>
                <option value="telugu">Telugu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎭 Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                disabled={loading}
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-100">
            <h3 className="font-semibold text-gray-800 mb-2">ℹ️ How it works:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Most slides will be <strong>text-based with voice narration</strong></li>
              <li>• Some slides may include <strong>images</strong> for context</li>
              <li>• Special topics get <strong>5-10 second animations</strong> (physics, math, algorithms)</li>
              <li>• Final video combines all slides with synchronized audio</li>
            </ul>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating Video...
              </span>
            ) : (
              "🎬 Generate Video Presentation"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
