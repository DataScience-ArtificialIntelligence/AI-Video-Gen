// // export default function VideoPlayer({ videoPath, content, script, onBack }) {
// //   return (
// //     <div className="min-h-screen bg-gray-900 p-4">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="flex items-center justify-between mb-6">
// //           <button
// //             onClick={onBack}
// //             className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
// //           >
// //             ← Back to Home
// //           </button>
// //           <h1 className="text-2xl font-bold text-white">
// //             {content?.topic || "Presentation"}
// //           </h1>
// //           <div className="w-32"></div> {/* Spacer for centering */}
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* Video Player */}
// //           <div className="lg:col-span-2">
// //             <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
// //               <video 
// //                 controls 
// //                 className="w-full"
// //                 src={`http://localhost:8000/api/video/${videoPath.split('/').pop()}`}
// //               >
// //                 Your browser does not support the video tag.
// //               </video>
// //             </div>

// //             {/* Video Info */}
// //             <div className="mt-4 bg-gray-800 rounded-lg p-4">
// //               <h2 className="text-xl font-semibold text-white mb-2">
// //                 {content?.topic}
// //               </h2>
// //               <div className="flex gap-4 text-sm text-gray-300">
// //                 <span>📊 {content?.total_slides} Slides</span>
// //                 <span>⏱️ {script?.total_duration?.toFixed(1)}s</span>
// //                 <span>🌐 {script?.language}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Slide Timeline */}
// //           <div className="bg-gray-800 rounded-xl p-4 max-h-[600px] overflow-y-auto">
// //             <h3 className="text-lg font-semibold text-white mb-4">
// //               📝 Slide Timeline
// //             </h3>
// //             <div className="space-y-3">
// //               {script?.slide_scripts?.map((slide, index) => (
// //                 <div 
// //                   key={index}
// //                   className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
// //                 >
// //                   <div className="flex items-start justify-between mb-2">
// //                     <span className="text-purple-400 font-semibold text-sm">
// //                       Slide {slide.slide_number}
// //                     </span>
// //                     <span className="text-gray-400 text-xs">
// //                       {slide.start_time.toFixed(1)}s - {slide.end_time.toFixed(1)}s
// //                     </span>
// //                   </div>
// //                   <p className="text-white text-sm font-medium mb-1">
// //                     {content?.slides?.[index]?.title}
// //                   </p>
// //                   <p className="text-gray-300 text-xs line-clamp-2">
// //                     {slide.narration_text}
// //                   </p>
                  
// //                   {/* Media indicators */}
// //                   <div className="flex gap-2 mt-2">
// //                     {content?.slides?.[index]?.needs_animation && (
// //                       <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded">
// //                         🎬 Animation
// //                       </span>
// //                     )}
// //                     {content?.slides?.[index]?.needs_image && (
// //                       <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
// //                         🖼️ Image
// //                       </span>
// //                     )}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Slide Details */}
// //         <div className="mt-6 bg-gray-800 rounded-xl p-6">
// //           <h3 className="text-xl font-semibold text-white mb-4">
// //             📄 Slide Content
// //           </h3>
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {content?.slides?.map((slide, index) => (
// //               <div 
// //                 key={index}
// //                 className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
// //               >
// //                 <div className="text-purple-400 font-semibold text-sm mb-2">
// //                   Slide {slide.slide_number}
// //                 </div>
// //                 <h4 className="text-white font-semibold mb-2">
// //                   {slide.title}
// //                 </h4>
// //                 <p className="text-gray-300 text-sm mb-3">
// //                   {slide.content_text}
// //                 </p>
// //                 <div className="flex flex-wrap gap-2">
// //                   {slide.needs_animation && (
// //                     <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded">
// //                       🎨 {slide.animation_description?.substring(0, 20)}...
// //                     </span>
// //                   )}
// //                   {slide.needs_image && (
// //                     <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
// //                       🖼️ {slide.image_keyword}
// //                     </span>
// //                   )}
// //                   <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
// //                     ⏱️ {slide.duration}s
// //                   </span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useRef, useState } from "react";

// export default function VideoPlayer({ videoPath, videoFilename, content, script, onBack }) {
//   const videoRef = useRef(null);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);

//   // Construct proper video URL using filename
//   const videoUrl = videoFilename 
//     ? `http://localhost:8000/api/video/${videoFilename}`
//     : videoPath 
//     ? `http://localhost:8000/api/video/${videoPath.split(/[/\\]/).pop()}` // Handle both / and \
//     : null;

//   console.log("🎥 VideoPlayer - videoFilename:", videoFilename);
//   console.log("🎥 VideoPlayer - videoPath:", videoPath);
//   console.log("🎥 VideoPlayer - Final videoUrl:", videoUrl);
//   // Jump to specific timestamp when clicking on slide
//   const handleSlideClick = (startTime) => {
//     if (videoRef.current) {
//       videoRef.current.currentTime = startTime;
//       videoRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   // Update current time as video plays
//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       setCurrentTime(videoRef.current.currentTime);
//     }
//   };

//   // Format seconds to MM:SS
//   const formatTime = (seconds) => {
//     if (!seconds || isNaN(seconds)) return "0:00";
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   // Check if current time is within a slide's duration
//   const isSlideActive = (startTime, endTime) => {
//     return currentTime >= startTime && currentTime < endTime;
//   };

//   if (!videoUrl) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-white text-center">
//           <p className="text-xl mb-4">❌ Video not available</p>
//           <button
//             onClick={onBack}
//             className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
//           >
//             ← Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <button
//             onClick={onBack}
//             className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
//           >
//             ← Back to Home
//           </button>
//           <h1 className="text-2xl font-bold text-white">
//             {content?.topic || "Presentation"}
//           </h1>
//           <div className="w-32"></div> {/* Spacer for centering */}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Video Player */}
//           <div className="lg:col-span-2">
//             <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
//               <video
//                 ref={videoRef}
//                 controls
//                 className="w-full"
//                 src={videoUrl}
//                 onTimeUpdate={handleTimeUpdate}
//                 onPlay={() => setIsPlaying(true)}
//                 onPause={() => setIsPlaying(false)}
//                 preload="metadata"
//               >
//                 <source src={videoUrl} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             </div>

//             {/* Video Info */}
//             <div className="mt-4 bg-gray-800 rounded-lg p-4">
//               <h2 className="text-xl font-semibold text-white mb-2">
//                 {content?.topic}
//               </h2>
//               <div className="flex gap-4 text-sm text-gray-300">
//                 <span>📊 {content?.total_slides || content?.slides?.length} Slides</span>
//                 <span>⏱️ {formatTime(script?.total_duration)}</span>
//                 <span>🌐 {script?.language || 'English'}</span>
//                 <span>🎭 Current: {formatTime(currentTime)}</span>
//               </div>
              
//               {/* Download Button */}
//               <div className="mt-4">
//                 <a
//                   href={videoUrl}
//                   download
//                   className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                   </svg>
//                   Download Video
//                 </a>
//               </div>
//             </div>
//           </div>

//           {/* Slide Timeline */}
//           <div className="bg-gray-800 rounded-xl p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
//             <h3 className="text-lg font-semibold text-white mb-4 sticky top-0 bg-gray-800 pb-2">
//               📝 Slide Timeline
//             </h3>
//             <div className="space-y-3">
//               {script?.slide_scripts?.map((slide, index) => {
//                 const isActive = isSlideActive(slide.start_time, slide.end_time);
                
//                 return (
//                   <div
//                     key={index}
//                     onClick={() => handleSlideClick(slide.start_time)}
//                     className={`rounded-lg p-3 transition-all cursor-pointer ${
//                       isActive
//                         ? 'bg-purple-600 ring-2 ring-purple-400 shadow-lg scale-105'
//                         : 'bg-gray-700 hover:bg-gray-600'
//                     }`}
//                   >
//                     <div className="flex items-start justify-between mb-2">
//                       <span className={`font-semibold text-sm flex items-center gap-2 ${
//                         isActive ? 'text-white' : 'text-purple-400'
//                       }`}>
//                         {isActive && (
//                           <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                           </svg>
//                         )}
//                         Slide {slide.slide_number}
//                       </span>
//                       <span className={`text-xs ${isActive ? 'text-purple-200' : 'text-gray-400'}`}>
//                         {formatTime(slide.start_time)} - {formatTime(slide.end_time)}
//                       </span>
//                     </div>
//                     <p className={`text-sm font-medium mb-1 ${
//                       isActive ? 'text-white' : 'text-white'
//                     }`}>
//                       {content?.slides?.[index]?.title}
//                     </p>
//                     <p className={`text-xs line-clamp-2 ${
//                       isActive ? 'text-purple-100' : 'text-gray-300'
//                     }`}>
//                       {slide.narration_text}
//                     </p>

//                     {/* Media indicators */}
//                     <div className="flex gap-2 mt-2">
//                       {content?.slides?.[index]?.needs_animation && (
//                         <span className={`text-xs px-2 py-1 rounded ${
//                           isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-300'
//                         }`}>
//                           🎬 Animation
//                         </span>
//                       )}
//                       {content?.slides?.[index]?.needs_image && (
//                         <span className={`text-xs px-2 py-1 rounded ${
//                           isActive ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-300'
//                         }`}>
//                           🖼️ Image
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Slide Details */}
//         <div className="mt-6 bg-gray-800 rounded-xl p-6">
//           <h3 className="text-xl font-semibold text-white mb-4">
//             📄 Slide Content
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {content?.slides?.map((slide, index) => {
//               const slideScript = script?.slide_scripts?.[index];
//               const isActive = slideScript && isSlideActive(slideScript.start_time, slideScript.end_time);

//               return (
//                 <div
//                   key={index}
//                   onClick={() => slideScript && handleSlideClick(slideScript.start_time)}
//                   className={`rounded-lg p-4 transition-all cursor-pointer ${
//                     isActive
//                       ? 'bg-purple-600 ring-2 ring-purple-400 shadow-lg'
//                       : 'bg-gray-700 hover:bg-gray-600'
//                   }`}
//                 >
//                   <div className={`font-semibold text-sm mb-2 ${
//                     isActive ? 'text-white' : 'text-purple-400'
//                   }`}>
//                     Slide {slide.slide_number}
//                     {isActive && (
//                       <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">
//                         ▶ Playing
//                       </span>
//                     )}
//                   </div>
//                   <h4 className="text-white font-semibold mb-2">
//                     {slide.title}
//                   </h4>
//                   <p className={`text-sm mb-3 ${
//                     isActive ? 'text-purple-100' : 'text-gray-300'
//                   }`}>
//                     {slide.content_text}
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {slide.needs_animation && (
//                       <span className={`text-xs px-2 py-1 rounded ${
//                         isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-300'
//                       }`}>
//                         🎨 {slide.animation_description?.substring(0, 20)}...
//                       </span>
//                     )}
//                     {slide.needs_image && (
//                       <span className={`text-xs px-2 py-1 rounded ${
//                         isActive ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-300'
//                       }`}>
//                         🖼️ {slide.image_keyword}
//                       </span>
//                     )}
//                     <span className={`text-xs px-2 py-1 rounded ${
//                       isActive ? 'bg-white/20 text-white' : 'bg-gray-600 text-gray-300'
//                     }`}>
//                       ⏱️ {formatTime(slide.duration)}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Custom Scrollbar Styles */}
//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #1f2937;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #4b5563;
//           border-radius: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #6b7280;
//         }
//       `}</style>
//     </div>
//   );
// }

// src/components/VideoPlayer.jsx
import { useRef, useState } from "react";

export default function VideoPlayer({ videoPath, videoFilename, content, script, onBack }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const videoUrl = videoFilename 
    ? `http://localhost:8000/api/video/${videoFilename}`
    : videoPath 
    ? `http://localhost:8000/api/video/${videoPath.split(/[/\\]/).pop()}`
    : null;

  console.log("🎥 VideoPlayer - videoFilename:", videoFilename);
  console.log("🎥 VideoPlayer - videoPath:", videoPath);
  console.log("🎥 VideoPlayer - Final videoUrl:", videoUrl);

  const handleSlideClick = (startTime) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSlideActive = (startTime, endTime) => {
    return currentTime >= startTime && currentTime < endTime;
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    
    setDownloading(true);
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = videoFilename || 'presentation.mp4';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading video');
    } finally {
      setDownloading(false);
    }
  };

  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">❌ Video not available</p>
          <button
            onClick={onBack}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-white">
            {content?.topic || "Presentation"}
          </h1>
          <div className="w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                controls
                className="w-full"
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                preload="metadata"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-2">
                {content?.topic}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                <span>📊 {content?.total_slides || content?.slides?.length} Slides</span>
                <span>⏱️ {formatTime(script?.total_duration)}</span>
                <span>🌐 {script?.language || 'English'}</span>
                <span>🎭 Current: {formatTime(currentTime)}</span>
              </div>
              
              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Video
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Slide Timeline */}
          <div className="bg-gray-800 rounded-xl p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-semibold text-white mb-4 sticky top-0 bg-gray-800 pb-2">
              📝 Slide Timeline
            </h3>
            <div className="space-y-3">
              {script?.slide_scripts?.map((slide, index) => {
                const isActive = isSlideActive(slide.start_time, slide.end_time);
                
                return (
                  <div
                    key={index}
                    onClick={() => handleSlideClick(slide.start_time)}
                    className={`rounded-lg p-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 ring-2 ring-purple-400 shadow-lg scale-105'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`font-semibold text-sm flex items-center gap-2 ${
                        isActive ? 'text-white' : 'text-purple-400'
                      }`}>
                        {isActive && (
                          <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                        Slide {slide.slide_number}
                      </span>
                      <span className={`text-xs ${isActive ? 'text-purple-200' : 'text-gray-400'}`}>
                        {formatTime(slide.start_time)} - {formatTime(slide.end_time)}
                      </span>
                    </div>
                    <p className={`text-sm font-medium mb-1 ${
                      isActive ? 'text-white' : 'text-white'
                    }`}>
                      {content?.slides?.[index]?.title}
                    </p>
                    <p className={`text-xs line-clamp-2 ${
                      isActive ? 'text-purple-100' : 'text-gray-300'
                    }`}>
                      {slide.narration_text}
                    </p>

                    {/* Media indicators */}
                    <div className="flex gap-2 mt-2">
                      {content?.slides?.[index]?.needs_animation && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          🎬 Animation
                        </span>
                      )}
                      {content?.slides?.[index]?.needs_image && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          isActive ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          🖼️ Image
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Slide Details Grid */}
        <div className="mt-6 bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            📄 Slide Content
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content?.slides?.map((slide, index) => {
              const slideScript = script?.slide_scripts?.[index];
              const isActive = slideScript && isSlideActive(slideScript.start_time, slideScript.end_time);

              return (
                <div
                  key={index}
                  onClick={() => slideScript && handleSlideClick(slideScript.start_time)}
                  className={`rounded-lg p-4 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 ring-2 ring-purple-400 shadow-lg'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className={`font-semibold text-sm mb-2 ${
                    isActive ? 'text-white' : 'text-purple-400'
                  }`}>
                    Slide {slide.slide_number}
                    {isActive && (
                      <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">
                        ▶ Playing
                      </span>
                    )}
                  </div>
                  <h4 className="text-white font-semibold mb-2">
                    {slide.title}
                  </h4>
                  <p className={`text-sm mb-3 line-clamp-3 ${
                    isActive ? 'text-purple-100' : 'text-gray-300'
                  }`}>
                    {slide.content_text}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {slide.needs_animation && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        🎬 Animation
                      </span>
                    )}
                    {slide.needs_image && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        🖼️ {slide.image_keyword}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      ⏱️ {formatTime(slide.duration)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}
