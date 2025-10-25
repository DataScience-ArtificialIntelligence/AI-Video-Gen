
// import { useState } from "react";
// import { generateSlides } from "../utils/api";

// export default function Home({ onSlidesReady }) {
//   const [topic, setTopic] = useState("");
//   const [slideCount, setSlideCount] = useState(5);
//   const [contentStyle, setContentStyle] = useState("brief");
//   const [includeImages, setIncludeImages] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleGenerate = async () => {
//     if (!topic.trim()) {
//       setError("Please enter a topic");
//       return;
//     }
    
//     setLoading(true);
//     setError("");
    
//     try {
//       const slides = await generateSlides({ 
//         topic, 
//         slideCount, 
//         contentStyle, 
//         includeImages  
//       });
      
//       if (!slides || slides.length === 0) {
//         throw new Error("No slides generated");
//       }
      
//       onSlidesReady(slides);
//     } catch (error) {
//       console.error("Generation error:", error);
//       setError(
//         error.response?.data?.details || 
//         error.message || 
//         "Error generating slides. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             AI Presentation Generator
//           </h1>
//           <p className="text-gray-600">Create stunning presentations in seconds</p>
//         </div>

//         <div className="space-y-6">
//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
//               <p className="text-sm font-medium">{error}</p>
//             </div>
//           )}

//           {/* Topic Input */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Presentation Topic
//             </label>
//             <input
//               value={topic}
//               onChange={(e) => {
//                 setTopic(e.target.value);
//                 setError("");
//               }}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && !loading) {
//                   handleGenerate();
//                 }
//               }}
//               placeholder="e.g., The Future of AI in Presentations"
//               className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg focus:border-blue-500 focus:outline-none transition-colors"
//               disabled={loading}
//             />
//           </div>

//           {/* Slide Count */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Number of Slides: {slideCount}
//             </label>
//             <input
//               type="range"
//               min={3}
//               max={15}
//               value={slideCount}
//               onChange={(e) => setSlideCount(Number(e.target.value))}
//               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
//               disabled={loading}
//             />
//             <div className="flex justify-between text-xs text-gray-500 mt-1">
//               <span>3</span>
//               <span>15</span>
//             </div>
//           </div>

//           {/* Content Style */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Content Style
//             </label>
//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 onClick={() => setContentStyle("brief")}
//                 disabled={loading}
//                 className={`p-4 rounded-lg border-2 transition-all ${
//                   contentStyle === "brief"
//                     ? "border-blue-600 bg-blue-50 text-blue-700"
//                     : "border-gray-300 hover:border-gray-400"
//                 } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <div className="font-semibold">Brief Points</div>
//                 <div className="text-xs text-gray-600 mt-1">
//                   Concise bullet points
//                 </div>
//               </button>
//               <button
//                 onClick={() => setContentStyle("detailed")}
//                 disabled={loading}
//                 className={`p-4 rounded-lg border-2 transition-all ${
//                   contentStyle === "detailed"
//                     ? "border-blue-600 bg-blue-50 text-blue-700"
//                     : "border-gray-300 hover:border-gray-400"
//                 } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <div className="font-semibold">Detailed</div>
//                 <div className="text-xs text-gray-600 mt-1">
//                   In-depth explanation
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Include Images Toggle */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <label className="flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={includeImages}
//                 onChange={(e) => setIncludeImages(e.target.checked)}
//                 disabled={loading}
//                 className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//               />
//               <div className="ml-3">
//                 <span className="text-sm font-semibold text-gray-700">
//                   Include Images
//                 </span>
//                 <p className="text-xs text-gray-500">
//                   Add relevant images to each slide automatically
//                 </p>
//               </div>
//             </label>
//           </div>

//           {/* Generate Button */}
//           <button
//             onClick={handleGenerate}
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg
//                   className="animate-spin h-5 w-5 mr-3"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                     fill="none"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   />
//                 </svg>
//                 Generating Slides...
//               </span>
//             ) : (
//               "Generate Presentation"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { generateSlides } from "../utils/api";

export default function Home({ onSlidesReady }) {
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState(5);
  const [contentStyle, setContentStyle] = useState("brief");
  const [includeImages, setIncludeImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const slides = await generateSlides({
        topic,
        slideCount,
        contentStyle,
        includeImages,
      });

      if (!slides || slides.length === 0) {
        throw new Error("No slides generated");
      }

      onSlidesReady(slides);
    } catch (error) {
      console.error("Generation error:", error);
      setError(
        error.response?.data?.details ||
          error.message ||
          "Error generating slides. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 AI Presentation Generator
          </h1>
          <p className="text-gray-600">
            Create stunning presentations with animations in seconds
          </p>
        </div>

        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Topic Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Presentation Topic
            </label>
            <input
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleGenerate();
                }
              }}
              placeholder="e.g., Explain Newton's Laws of Motion, Pythagorean Theorem"
              className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg focus:border-blue-500 focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>

          {/* Slide Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Slides: {slideCount}
            </label>
            <input
              type="range"
              min={3}
              max={15}
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>3</span>
              <span>15</span>
            </div>
          </div>

          {/* Content Style */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content Style
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setContentStyle("brief")}
                disabled={loading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  contentStyle === "brief"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="font-semibold">Brief Points</div>
                <div className="text-xs text-gray-600 mt-1">
                  Concise bullet points
                </div>
              </button>
              <button
                onClick={() => setContentStyle("detailed")}
                disabled={loading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  contentStyle === "detailed"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="font-semibold">Detailed</div>
                <div className="text-xs text-gray-600 mt-1">
                  In-depth explanation
                </div>
              </button>
            </div>
          </div>

          {/* Include Images Toggle */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                disabled={loading}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="ml-3">
                <span className="text-sm font-semibold text-gray-700">
                  Include Images/Animations
                </span>
                <p className="text-xs text-gray-500">
                  Add animations for concepts or images for other topics
                </p>
              </div>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  viewBox="0 0 24 24"
                >
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
                Generating Slides...
              </span>
            ) : (
              "✨ Generate Presentation"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
