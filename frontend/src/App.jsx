
// // import { useState } from "react";
// // import Home from "./components/Home";
// // import SlidePreview from "./components/SlidePreview";
// // import VideoPlayer from "./components/VideoPlayer";

// // function App() {
// //   const [generatedData, setGeneratedData] = useState(null);
// //   const [view, setView] = useState("home");

// //   const handleGenerationComplete = (data) => {
// //     console.log("🎬 App.jsx - Generation complete data:", data);
// //     console.log("🎬 App.jsx - videoFilename:", data.videoFilename);
// //     console.log("🎬 App.jsx - videoPath:", data.videoPath);
    
// //     setGeneratedData(data);
// //     setView("preview");
// //   };

// //   const handleBackToHome = () => {
// //     setView("home");
// //     setGeneratedData(null);
// //   };

// //   const switchToPlayer = () => {
// //     setView("player");
// //   };

// //   const switchToPreview = () => {
// //     setView("preview");
// //   };

// //   return (
// //     <div className="min-h-screen">
// //       {view === "home" && (
// //         <Home onGenerationComplete={handleGenerationComplete} />
// //       )}

// //       {view === "preview" && generatedData && (
// //         <div className="min-h-screen bg-gray-900">
// //           {/* Navigation Header - Only show when content is ready */}
// //           {generatedData.content?.slides?.length > 0 && (
// //             <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-50">
// //               <div className="max-w-7xl mx-auto flex items-center justify-between">
// //                 <button
// //                   onClick={handleBackToHome}
// //                   className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
// //                 >
// //                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
// //                   </svg>
// //                   Back to Home
// //                 </button>

// //                 <div className="flex items-center gap-4">
// //                   <span className="text-gray-400 text-sm">
// //                     {generatedData.content?.slides?.length || 0} slides • {" "}
// //                     {Math.floor(generatedData.script?.total_duration / 60)}:{Math.floor(generatedData.script?.total_duration % 60).toString().padStart(2, '0')} duration
// //                   </span>
// //                   {generatedData.videoFilename && (
// //                     <button
// //                       onClick={switchToPlayer}
// //                       className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
// //                     >
// //                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// //                         <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
// //                       </svg>
// //                       Watch Video
// //                     </button>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           <SlidePreview
// //             slides={generatedData.content?.slides || []}
// //             generationId={generatedData.generationId}
// //             videoFilename={generatedData.videoFilename}
// //             scriptData={generatedData.script}
// //           />
// //         </div>
// //       )}

// //       {view === "player" && generatedData && (
// //         <VideoPlayer
// //           videoPath={generatedData.videoPath}
// //           videoFilename={generatedData.videoFilename}
// //           content={generatedData.content}
// //           script={generatedData.script}
// //           onBack={switchToPreview}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // export default App;
// // src/App.jsx
// import { useState } from "react";
// import Home from "./components/Home";
// import SlidePreview from "./components/SlidePreview";
// import VideoPlayer from "./components/VideoPlayer";

// function App() {
//   const [generatedData, setGeneratedData] = useState(null);
//   const [view, setView] = useState("home");

//   const handleGenerationComplete = (data) => {
//     console.log("🎬 App.jsx - Generation complete data:", data);
//     console.log("🎬 App.jsx - videoFilename:", data.videoFilename);
//     console.log("🎬 App.jsx - videoPath:", data.videoPath);
    
//     setGeneratedData(data);
//     setView("preview");
//   };

//   const handleBackToHome = () => {
//     setView("home");
//     setGeneratedData(null);
//   };

//   const switchToPlayer = () => {
//     setView("player");
//   };

//   const switchToPreview = () => {
//     setView("preview");
//   };

//   return (
//     <div className="min-h-screen">
//       {view === "home" && (
//         <Home onGenerationComplete={handleGenerationComplete} />
//       )}

//       {view === "preview" && generatedData && (
//         <div className="min-h-screen bg-gray-900">
//           {/* Navigation Header - Only show when content is ready */}
//           {generatedData.content?.slides?.length > 0 && (
//             <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-50">
//               <div className="max-w-7xl mx-auto flex items-center justify-between">
//                 <button
//                   onClick={handleBackToHome}
//                   className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                   </svg>
//                   Back to Home
//                 </button>

//                 <div className="flex items-center gap-4">
//                   <span className="text-gray-400 text-sm">
//                     {generatedData.content?.slides?.length || 0} slides • {" "}
//                     {Math.floor(generatedData.script?.total_duration / 60)}:{Math.floor(generatedData.script?.total_duration % 60).toString().padStart(2, '0')} duration
//                   </span>
//                   {generatedData.videoFilename && (
//                     <button
//                       onClick={switchToPlayer}
//                       className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//                     >
//                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
//                       </svg>
//                       Watch Video
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           <SlidePreview
//             slides={generatedData.content?.slides || []}
//             generationId={generatedData.generationId}
//             videoFilename={generatedData.videoFilename}
//             scriptData={generatedData.script}
//           />
//         </div>
//       )}

//       {view === "player" && generatedData && (
//         <VideoPlayer
//           videoPath={generatedData.videoPath}
//           videoFilename={generatedData.videoFilename}
//           content={generatedData.content}
//           script={generatedData.script}
//           onBack={switchToPreview}
//         />
//       )}
//     </div>
//   );
// }

// export default App;
// src/App.jsx
import { useState } from "react";
import Home from "./components/Home";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  const [generatedData, setGeneratedData] = useState(null);
  const [view, setView] = useState("home");

  const handleGenerationComplete = (data) => {
    console.log("🎬 App.jsx - Generation complete data:", data);
    console.log("🎬 App.jsx - videoFilename:", data.videoFilename);
    console.log("🎬 App.jsx - videoPath:", data.videoPath);
    
    setGeneratedData(data);
    setView("player");
  };

  const handleBackToHome = () => {
    setView("home");
    setGeneratedData(null);
  };

  return (
    <div className="min-h-screen">
      {view === "home" && (
        <Home onGenerationComplete={handleGenerationComplete} />
      )}

      {view === "player" && generatedData && (
        <VideoPlayer
          videoPath={generatedData.videoPath}
          videoFilename={generatedData.videoFilename}
          content={generatedData.content}
          script={generatedData.script}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;
