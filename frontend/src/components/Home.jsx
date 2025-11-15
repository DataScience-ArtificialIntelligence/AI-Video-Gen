
<<<<<<< HEAD
// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import ProgressTerminal from "./StepProgress";
// // import { useSSEProgress } from "../hooks/useSSEProgress";

// // export default function Home({ onGenerationComplete }) {
// //   const [topic, setTopic] = useState("");
// //   const [numSlides, setNumSlides] = useState(5);
// //   const [language, setLanguage] = useState("english");
// //   const [tone, setTone] = useState("formal");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [generationId, setGenerationId] = useState(null);
  
// //   // Use the SSE hook - only connect when we have a generationId
// //   const { progress, status, message, logs, isConnected, clearLogs, disconnect } = 
// //     useSSEProgress(generationId, !!generationId);

// //   // Auto-transition when completed
// //   useEffect(() => {
// //     if (status === 'completed' && !loading) {
// //       // Give user a moment to see completion message
// //       const timer = setTimeout(() => {
// //         console.log('✅ Generation completed, transitioning...');
// //       }, 1000);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [status, loading]);

// //   const handleGenerate = async () => {
// //     if (!topic.trim()) {
// //       setError("Please enter a topic");
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");
// //     clearLogs();

// //     // Create generation ID (same sanitization as backend)
// //     const genId = topic
// //       .slice(0, 30)
// //       .replace(/ /g, '_')
// //       .replace(/[:"'/?!\\]/g, '');

// //     console.log("🎬 Starting generation with ID:", genId);

// //     // Set generation ID to trigger SSE connection
// //     setGenerationId(genId);

// //     // Wait a bit for SSE to connect
// //     await new Promise(resolve => setTimeout(resolve, 1000));

// //     try {
// //       // Start the generation request
// //       console.log('🚀 Triggering generation API...');
// //       const response = await axios.post("http://localhost:8000/api/generate", {
// //         topic,
// //         num_slides: numSlides,
// //         language,
// //         tone
// //       });

// //       console.log('✅ Generation API response:', response.data);
// //       console.log('✅ video_filename from API:', response.data.video_filename);
// //       console.log('✅ video_path from API:', response.data.video_path);

// //       if (response.data.status === "success") {
// //         // Prepare data to pass to parent
// //         const generatedData = {
// //           content: response.data.content_data,
// //           script: response.data.script_data,
// //           videoPath: response.data.video_path,
// //           videoFilename: response.data.video_filename,
// //           generationId: genId
// //         };

// //         console.log('✅ About to call onGenerationComplete with:', generatedData);

// //         // Pass data to parent after a short delay
// //         setTimeout(() => {
// //           onGenerationComplete(generatedData);
// //           disconnect();
// //           // Reset form for next generation
// //           setGenerationId(null);
// //         }, 1500);
// //       }
// //     } catch (err) {
// //       console.error("❌ Generation error:", err);
// //       const errorMsg = err.response?.data?.detail || err.message || "Error generating video. Please try again.";
// //       setError(errorMsg);
// //       disconnect();
// //       setGenerationId(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
// //       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
// //         <div className="text-center mb-8">
// //           <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
// //             🎬 AI Video Presentation Generator
// //           </h1>
// //           <p className="text-gray-600 text-lg">
// //             Create educational videos with PPT slides, animations, and voice narration
// //           </p>
// //         </div>

// //         <div className="space-y-6">
// //           {error && (
// //             <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
// //               <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
// //                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //               </svg>
// //               <div className="flex-1">
// //                 <p className="font-medium">Error</p>
// //                 <p className="text-sm mt-1">{error}</p>
// //               </div>
// //             </div>
// //           )}

// //           {/* Progress Terminal - Show when loading */}
// //           {loading && (
// //             <ProgressTerminal 
// //               logs={logs} 
// //               progress={progress} 
// //               status={status}
// //               isConnected={isConnected}
// //             />
// //           )}

// //           {/* Success Status - Brief celebration before transition */}
// //           {!loading && status === 'completed' && (
// //             <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-2xl animate-pulse">
// //               <div className="flex items-center gap-4">
// //                 <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
// //                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
// //                 </svg>
// //                 <div>
// //                   <p className="text-sm font-semibold text-green-100 uppercase tracking-wide mb-1">
// //                     Success!
// //                   </p>
// //                   <p className="text-2xl font-bold text-white">Video generated successfully!</p>
// //                   <p className="text-green-100 text-sm mt-1">Loading preview...</p>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Form - Hide while processing */}
// //           {!loading && (
// //             <>
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   📝 Topic / Prompt
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={topic}
// //                   onChange={(e) => setTopic(e.target.value)}
// //                   onKeyPress={(e) => e.key === 'Enter' && !loading && topic.trim() && handleGenerate()}
// //                   placeholder="e.g., Explain Newton's Third Law of Motion"
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
// //                   disabled={loading}
// //                 />
// //               </div>

// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                     📊 Number of Slides
// //                   </label>
// //                   <input
// //                     type="number"
// //                     value={numSlides}
// //                     onChange={(e) => setNumSlides(parseInt(e.target.value) || 5)}
// //                     min="3"
// //                     max="10"
// //                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
// //                     disabled={loading}
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                     🌐 Language
// //                   </label>
// //                   <select
// //                     value={language}
// //                     onChange={(e) => setLanguage(e.target.value)}
// //                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
// //                     disabled={loading}
// //                   >
// //                     <option value="english">English</option>
// //                     <option value="hindi">Hindi</option>
// //                     <option value="kannada">Kannada</option>
// //                     <option value="telugu">Telugu</option>
// //                   </select>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                     🎭 Tone
// //                   </label>
// //                   <select
// //                     value={tone}
// //                     onChange={(e) => setTone(e.target.value)}
// //                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
// //                     disabled={loading}
// //                   >
// //                     <option value="formal">Formal</option>
// //                     <option value="casual">Casual</option>
// //                     <option value="enthusiastic">Enthusiastic</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-100">
// //                 <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
// //                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// //                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// //                   </svg>
// //                   How it works
// //                 </h3>
// //                 <ul className="text-sm text-gray-600 space-y-1.5">
// //                   <li className="flex items-start gap-2">
// //                     <span className="text-purple-600 font-bold">•</span>
// //                     <span>Most slides will be <strong>text-based with voice narration</strong></span>
// //                   </li>
// //                   <li className="flex items-start gap-2">
// //                     <span className="text-purple-600 font-bold">•</span>
// //                     <span>Some slides may include <strong>images</strong> for context</span>
// //                   </li>
// //                   <li className="flex items-start gap-2">
// //                     <span className="text-purple-600 font-bold">•</span>
// //                     <span>Special topics get <strong>5-10 second animations</strong> (physics, math, algorithms)</span>
// //                   </li>
// //                   <li className="flex items-start gap-2">
// //                     <span className="text-purple-600 font-bold">•</span>
// //                     <span>Final video combines all slides with synchronized audio</span>
// //                   </li>
// //                   <li className="flex items-start gap-2">
// //                     <span className="text-purple-600 font-bold">•</span>
// //                     <span>Real-time progress updates show generation status</span>
// //                   </li>
// //                 </ul>
// //               </div>

// //               <button
// //                 onClick={handleGenerate}
// //                 disabled={loading || !topic.trim()}
// //                 className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
// //               >
// //                 {loading ? (
// //                   <span className="flex items-center justify-center gap-3">
// //                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
// //                       <circle
// //                         className="opacity-25"
// //                         cx="12"
// //                         cy="12"
// //                         r="10"
// //                         stroke="currentColor"
// //                         strokeWidth="4"
// //                         fill="none"
// //                       />
// //                       <path
// //                         className="opacity-75"
// //                         fill="currentColor"
// //                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// //                       />
// //                     </svg>
// //                     <span>Processing... {progress}%</span>
// //                   </span>
// //                 ) : (
// //                   <span className="flex items-center justify-center gap-2">
// //                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// //                       <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
// //                     </svg>
// //                     Generate Video Presentation
// //                   </span>
// //                 )}
// //               </button>

// //               {/* Tips Section */}
// //               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
// //                 <p className="text-xs text-gray-500 text-center">
// //                   💡 <strong>Tip:</strong> Be specific with your topic for better results. 
// //                   For example: "Explain photosynthesis in plants" instead of just "photosynthesis"
// //                 </p>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // src/components/Home.jsx
// import { useState } from "react";
// import axios from "axios";

// export default function Home({ onGenerationComplete }) {
//   const [topic, setTopic] = useState("");
//   const [numSlides, setNumSlides] = useState(5);
//   const [language, setLanguage] = useState("english");
//   const [tone, setTone] = useState("formal");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [generationId, setGenerationId] = useState(null);
=======
// import { useState } from "react";
// import { generateSlides } from "../utils/api";

// export default function Home({ onSlidesReady }) {
//   const [topic, setTopic] = useState("");
//   const [slideCount, setSlideCount] = useState(5);
//   const [contentStyle, setContentStyle] = useState("brief");
//   const [includeImages, setIncludeImages] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb

//   const handleGenerate = async () => {
//     if (!topic.trim()) {
//       setError("Please enter a topic");
//       return;
//     }
<<<<<<< HEAD

//     setLoading(true);
//     setError("");

//     const genId = topic
//       .slice(0, 30)
//       .replace(/ /g, '_')
//       .replace(/[:"'/?!\\]/g, '');

//     console.log("🎬 Starting generation with ID:", genId);
//     setGenerationId(genId);

//     try {
//       console.log('🚀 Triggering generation API...');
//       const response = await axios.post("http://localhost:8000/api/generate", {
//         topic,
//         num_slides: numSlides,
//         language,
//         tone
//       });

//       console.log('✅ Generation API response:', response.data);

//       if (response.data.status === "success") {
//         const generatedData = {
//           content: response.data.content_data,
//           script: response.data.script_data,
//           videoPath: response.data.video_path,
//           videoFilename: response.data.video_filename,
//           generationId: genId
//         };

//         console.log('✅ About to call onGenerationComplete with:', generatedData);

//         setTimeout(() => {
//           onGenerationComplete(generatedData);
//           setGenerationId(null);
//           setLoading(false);
//         }, 1000);
//       }
//     } catch (err) {
//       console.error("❌ Generation error:", err);
//       const errorMsg = err.response?.data?.detail || err.message || "Error generating video. Please try again.";
//       setError(errorMsg);
//       setGenerationId(null);
=======
    
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
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//       setLoading(false);
//     }
//   };

//   return (
<<<<<<< HEAD
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
//         <div className="text-center mb-8">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
//             🎬 AI Video Presentation Generator
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Create educational videos with PPT slides, animations, and voice narration
//           </p>
//         </div>

//         <div className="space-y-6">
//           {error && (
//             <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
//               <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//               <div className="flex-1">
//                 <p className="font-medium">Error</p>
//                 <p className="text-sm mt-1">{error}</p>
//               </div>
//             </div>
//           )}

//           {!loading && (
//             <>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   📝 Topic / Prompt
//                 </label>
//                 <input
//                   type="text"
//                   value={topic}
//                   onChange={(e) => setTopic(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && !loading && topic.trim() && handleGenerate()}
//                   placeholder="e.g., Explain Newton's Third Law of Motion"
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
//                   disabled={loading}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     📊 Number of Slides
//                   </label>
//                   <input
//                     type="number"
//                     value={numSlides}
//                     onChange={(e) => setNumSlides(parseInt(e.target.value) || 5)}
//                     min="3"
//                     max="10"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     🌐 Language
//                   </label>
//                   <select
//                     value={language}
//                     onChange={(e) => setLanguage(e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
//                     disabled={loading}
//                   >
//                     <option value="english">English</option>
//                     <option value="hindi">Hindi</option>
//                     <option value="kannada">Kannada</option>
//                     <option value="telugu">Telugu</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     🎭 Tone
//                   </label>
//                   <select
//                     value={tone}
//                     onChange={(e) => setTone(e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
//                     disabled={loading}
//                   >
//                     <option value="formal">Formal</option>
//                     <option value="casual">Casual</option>
//                     <option value="enthusiastic">Enthusiastic</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-100">
//                 <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                   </svg>
//                   How it works
//                 </h3>
//                 <ul className="text-sm text-gray-600 space-y-1.5">
//                   <li className="flex items-start gap-2">
//                     <span className="text-purple-600 font-bold">•</span>
//                     <span>Most slides will be <strong>text-based with voice narration</strong></span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-purple-600 font-bold">•</span>
//                     <span>Some slides may include <strong>images</strong> for context</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-purple-600 font-bold">•</span>
//                     <span>Special topics get <strong>5-10 second animations</strong> (physics, math, algorithms)</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-purple-600 font-bold">•</span>
//                     <span>Final video combines all slides with synchronized audio</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-purple-600 font-bold">•</span>
//                     <span>Check backend console for detailed generation logs</span>
//                   </li>
//                 </ul>
//               </div>

//               <button
//                 onClick={handleGenerate}
//                 disabled={loading || !topic.trim()}
//                 className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
//               >
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
//                   </svg>
//                   Generate Video Presentation
//                 </span>
//               </button>

//               {/* Tips Section */}
//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                 <p className="text-xs text-gray-500 text-center">
//                   💡 <strong>Tip:</strong> Be specific with your topic for better results. 
//                   For example: "Explain photosynthesis in plants" instead of just "photosynthesis"
//                 </p>
//               </div>
//             </>
//           )}

//           {loading && (
//             <div className="flex flex-col items-center justify-center py-12">
//               <div className="mb-4">
//                 <svg className="animate-spin h-12 w-12 text-purple-600" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2">Generating your presentation...</h3>
//               <p className="text-gray-600 text-center">
//                 Please wait while we create your video. This process may take several minutes.
//               </p>
//               <p className="text-gray-500 text-sm mt-3">
//                 Check your backend console for detailed progress logs.
//               </p>
//             </div>
//           )}
=======
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
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//         </div>
//       </div>
//     </div>
//   );
// }
<<<<<<< HEAD
// src/components/Home.jsx
import { useState } from "react";
import axios from "axios";

export default function Home({ onGenerationComplete }) {
  const [topic, setTopic] = useState("");
  const [numSlides, setNumSlides] = useState(5);
  const [language, setLanguage] = useState("english");
  const [tone, setTone] = useState("formal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generationId, setGenerationId] = useState(null);
=======

import { useState } from "react";
import { generateSlides } from "../utils/api";

export default function Home({ onSlidesReady }) {
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState(5);
  const [contentStyle, setContentStyle] = useState("brief");
  const [includeImages, setIncludeImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");

<<<<<<< HEAD
    const genId = topic
      .slice(0, 30)
      .replace(/ /g, '_')
      .replace(/[:"'/?!\\]/g, '');

    console.log("🎬 Starting generation with ID:", genId);
    setGenerationId(genId);

    try {
      console.log('🚀 Triggering generation API...');
      const response = await axios.post("http://localhost:8000/api/generate", {
        topic,
        num_slides: numSlides,
        language,
        tone
      });

      console.log('✅ Generation API response:', response.data);

      if (response.data.status === "success") {
        const generatedData = {
          content: response.data.content_data,
          script: response.data.script_data,
          videoPath: response.data.video_path,
          videoFilename: response.data.video_filename,
          generationId: genId
        };

        console.log('✅ About to call onGenerationComplete with:', generatedData);

        setTimeout(() => {
          onGenerationComplete(generatedData);
          setGenerationId(null);
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      console.error("❌ Generation error:", err);
      const errorMsg = err.response?.data?.detail || err.message || "Error generating video. Please try again.";
      setError(errorMsg);
      setGenerationId(null);
=======
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
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            🎬 AI Video Presentation Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Create educational videos with PPT slides, animations, and voice narration
=======
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 AI Presentation Generator
          </h1>
          <p className="text-gray-600">
            Create stunning presentations with animations in seconds
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
          </p>
        </div>

        <div className="space-y-6">
<<<<<<< HEAD
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {!loading && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📝 Topic / Prompt
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && topic.trim() && handleGenerate()}
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
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  How it works
                </h3>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Most slides will be <strong>text-based with voice narration</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Some slides may include <strong>images</strong> for context</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Special topics get <strong>5-10 second animations</strong> (physics, math, algorithms)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Final video combines all slides with synchronized audio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Check backend console for detailed generation logs</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Generate Video Presentation
                </span>
              </button>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  💡 <strong>Tip:</strong> Be specific with your topic for better results. 
                  For example: "Explain photosynthesis in plants" instead of just "photosynthesis"
                </p>
              </div>
            </>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4">
                <svg className="animate-spin h-12 w-12 text-purple-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Generating your presentation...</h3>
              <p className="text-gray-600 text-center">
                Please wait while we create your video. This process may take several minutes.
              </p>
              <p className="text-gray-500 text-sm mt-3">
                Check your backend console for detailed progress logs.
              </p>
            </div>
          )}
=======
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
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
        </div>
      </div>
    </div>
  );
}
