import { useState } from "react";
import axios from "axios";

export default function Home({ onGenerationComplete }) {
  const [topic, setTopic] = useState("");
  const [numSlides, setNumSlides] = useState(5);
  const [language, setLanguage] = useState("english");
  const [tone, setTone] = useState("formal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setCurrentStatus("Starting generation...");

    // Create generation ID (same sanitization as backend)
    const generationId = topic.slice(0, 30)
      .replace(/ /g, '_')
      .replace(/[:"'/?!]/g, '');

    let eventSource = null;

    try {
      // Start the generation request (non-blocking)
      const generatePromise = axios.post("http://localhost:8000/api/generate", {
        topic,
        num_slides: numSlides,
        language,
        tone
      });

      // Wait 500ms for backend to create status, then start SSE
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('🔌 Starting SSE for generation_id:', generationId);

      // Start SSE connection for status updates
      eventSource = new EventSource(`http://localhost:8000/api/progress/${generationId}`);
      
      eventSource.onopen = () => {
        console.log('✅ SSE connected!');
      };

      eventSource.onmessage = (event) => {
        console.log('📨 SSE raw data:', event.data);
        
        try {
          const data = JSON.parse(event.data);
          console.log('📊 Parsed:', data);
          console.log('🔄 Setting status:', data.message);
          
          // Update status
          setCurrentStatus(data.message);
          
          // Close connection when complete or error
          if (data.status === 'completed' || data.status === 'error') {
            console.log('🏁 Closing SSE');
            eventSource.close();
          }
        } catch (e) {
          console.error('❌ Parse error:', e, event.data);
        }
      };

      eventSource.onerror = (error) => {
        console.error('❌ SSE error:', error);
        if (eventSource) {
          eventSource.close();
        }
      };

      // Wait for generation to complete
      const response = await generatePromise;

      if (response.data.status === "success") {
        setCurrentStatus("✅ Video generated successfully!");

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
      setCurrentStatus("");
    } finally {
      setLoading(false);
      if (eventSource) {
        eventSource.close();
      }
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

          {currentStatus && !error && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 shadow-2xl">
              <div>
                <p className="text-sm font-semibold text-indigo-100 uppercase tracking-wide mb-2">
                  Current Status
                </p>
                <p className="text-2xl font-bold text-white">
                  {currentStatus}
                </p>
              </div>
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
            {loading ? "⏳ Processing..." : "🎬 Generate Video Presentation"}
          </button>
        </div>
      </div>
    </div>
  );
}
