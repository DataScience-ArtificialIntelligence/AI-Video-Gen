
<<<<<<< HEAD
// // // export default function SlidePreview({ slides }) {
// // //   const getThemeStyles = (theme) => {
// // //     switch (theme) {
// // //       case "dark":
// // //         return { 
// // //           background: "#1f2937", 
// // //           color: "#f9fafb",
// // //           accent: "#60a5fa"
// // //         };
// // //       case "minimal":
// // //         return { 
// // //           background: "#ffffff", 
// // //           color: "#111827",
// // //           accent: "#3b82f6"
// // //         };
// // //       case "vibrant":
// // //         return {
// // //           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// // //           color: "#ffffff",
// // //           accent: "#fbbf24"
// // //         };
// // //       case "creative":
// // //         return {
// // //           background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
// // //           color: "#ffffff",
// // //           accent: "#fde047"
// // //         };
// // //       case "professional":
// // //       default:
// // //         return {
// // //           background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
// // //           color: "#ffffff",
// // //           accent: "#e0f2fe"
// // //         };
// // //     }
// // //   };

// // //   // All slides have the same theme
// // //   const presentationTheme = slides[0]?.theme || "professional";
// // //   const themeStyles = getThemeStyles(presentationTheme);

// // //   return (
// // //     <div className="min-h-screen bg-gray-900 p-10">
// // //       <div className="max-w-5xl mx-auto space-y-8">
// // //         {/* Header */}
// // //         <div className="flex items-center justify-between">
// // //           <div>
// // //             <h2 className="text-3xl font-bold text-white mb-2">
// // //               Slide Preview
// // //             </h2>
// // //             <p className="text-gray-400 text-sm">
// // //               {slides.length} slides • Theme: <span className="capitalize font-semibold">{presentationTheme}</span>
// // //             </p>
// // //           </div>
// // //           <div className="bg-gray-800 px-4 py-2 rounded-lg">
// // //             <p className="text-xs text-gray-400">Slides with images</p>
// // //             <p className="text-2xl font-bold text-white">
// // //               {slides.filter(s => s.includeImage && s.image).length}/{slides.length}
// // //             </p>
// // //           </div>
// // //         </div>

// // //         {/* Slides */}
// // //         {slides.map((s, i) => {
// // //           const hasImage = s.image && s.includeImage !== false;
// // //           const imagePosition = s.imagePosition || "right";

// // //           return (
// // //             <div
// // //               key={i}
// // //               className="rounded-xl shadow-2xl overflow-hidden relative"
// // //               style={{
// // //                 background: themeStyles.background,
// // //                 color: themeStyles.color,
// // //                 minHeight: "450px",
// // //               }}
// // //             >
// // //               <div className="relative z-10 p-10">
// // //                 {/* Header with Slide Number */}
// // //                 <div className="flex items-start justify-between mb-4">
// // //                   <div className="flex-1">
// // //                     <h3 className="text-4xl font-bold leading-tight mb-2">
// // //                       {s.title}
// // //                     </h3>
// // //                   </div>
// // //                   <div 
// // //                     className="text-sm px-3 py-1 rounded-lg ml-4"
// // //                     style={{ 
// // //                       backgroundColor: themeStyles.accent,
// // //                       color: presentationTheme === "minimal" ? "#111827" : "#000000",
// // //                       opacity: 0.8
// // //                     }}
// // //                   >
// // //                     {i + 1} / {slides.length}
// // //                   </div>
// // //                 </div>

// // //                 {/* Blue separator */}
// // //                 <div 
// // //                   className="h-1 mb-6 rounded"
// // //                   style={{ backgroundColor: themeStyles.accent }}
// // //                 ></div>

// // //                 {/* Content Layout Based on Image Position */}
// // //                 {hasImage ? (
// // //                   <div className="grid grid-cols-2 gap-8 items-start">
// // //                     {/* Left Side Content or Image */}
// // //                     {imagePosition === "left" ? (
// // //                       <>
// // //                         {/* Image on Left */}
// // //                         <div className="order-1">
// // //                           <img
// // //                             src={s.image}
// // //                             alt={s.imageKeyword || s.title}
// // //                             className="rounded-lg w-full h-full object-cover shadow-lg"
// // //                             style={{ maxHeight: "320px" }}
// // //                           />
// // //                           {s.imageKeyword && (
// // //                             <p 
// // //                               className="text-xs mt-2 italic"
// // //                               style={{ opacity: 0.6 }}
// // //                             >
// // //                               {s.imageKeyword}
// // //                             </p>
// // //                           )}
// // //                         </div>
// // //                         {/* Content on Right */}
// // //                         <div className="order-2">
// // //                           <p className="whitespace-pre-line text-lg leading-relaxed">
// // //                             {s.content}
// // //                           </p>
// // //                         </div>
// // //                       </>
// // //                     ) : (
// // //                       <>
// // //                         {/* Content on Left */}
// // //                         <div className="order-1">
// // //                           <p className="whitespace-pre-line text-lg leading-relaxed">
// // //                             {s.content}
// // //                           </p>
// // //                         </div>
// // //                         {/* Image on Right */}
// // //                         <div className="order-2">
// // //                           <img
// // //                             src={s.image}
// // //                             alt={s.imageKeyword || s.title}
// // //                             className="rounded-lg w-full h-full object-cover shadow-lg"
// // //                             style={{ maxHeight: "320px" }}
// // //                           />
// // //                           {s.imageKeyword && (
// // //                             <p 
// // //                               className="text-xs mt-2 italic text-right"
// // //                               style={{ opacity: 0.6 }}
// // //                             >
// // //                               {s.imageKeyword}
// // //                             </p>
// // //                           )}
// // //                         </div>
// // //                       </>
// // //                     )}
// // //                   </div>
// // //                 ) : (
// // //                   // No Image - Full Width Content
// // //                   <div className="max-w-4xl">
// // //                     <p className="whitespace-pre-line text-lg leading-relaxed">
// // //                       {s.content}
// // //                     </p>
// // //                   </div>
// // //                 )}

// // //                 {/* Footer Info */}
// // //                 <div 
// // //                   className="mt-6 pt-4 flex items-center justify-between text-sm"
// // //                   style={{ 
// // //                     borderTop: `1px solid ${themeStyles.accent}`,
// // //                     opacity: 0.6
// // //                   }}
// // //                 >
// // //                   <span>Slide {i + 1}</span>
// // //                   {hasImage && (
// // //                     <span className="flex items-center gap-2">
// // //                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
// // //                         <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
// // //                       </svg>
// // //                       Image: {imagePosition}
// // //                     </span>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           );
// // //         })}

// // //         {/* Summary Card */}
// // //         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
// // //           <h3 className="text-xl font-bold text-white mb-4">Presentation Summary</h3>
// // //           <div className="grid grid-cols-3 gap-6">
// // //             <div>
// // //               <p className="text-gray-400 text-sm mb-1">Total Slides</p>
// // //               <p className="text-3xl font-bold text-white">{slides.length}</p>
// // //             </div>
// // //             <div>
// // //               <p className="text-gray-400 text-sm mb-1">Theme</p>
// // //               <p className="text-3xl font-bold text-white capitalize">{presentationTheme}</p>
// // //             </div>
// // //             <div>
// // //               <p className="text-gray-400 text-sm mb-1">With Images</p>
// // //               <p className="text-3xl font-bold text-white">
// // //                 {slides.filter(s => s.includeImage && s.image).length}
// // //               </p>
// // //             </div>
// // //           </div>
          
// // //           {/* Image Distribution */}
// // //           <div className="mt-6 pt-6 border-t border-gray-700">
// // //             <p className="text-gray-400 text-sm mb-3">Image Distribution</p>
// // //             <div className="flex gap-2">
// // //               {slides.map((s, i) => (
// // //                 <div
// // //                   key={i}
// // //                   className={`flex-1 h-2 rounded ${
// // //                     s.includeImage && s.image ? 'bg-green-500' : 'bg-gray-600'
// // //                   }`}
// // //                   title={`Slide ${i + 1}${s.includeImage ? ` - ${s.imagePosition}` : ' - No image'}`}
// // //                 />
// // //               ))}
// // //             </div>
// // //             <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
// // //               <div className="flex items-center gap-1">
// // //                 <div className="w-3 h-3 bg-green-500 rounded"></div>
// // //                 <span>With Image</span>
// // //               </div>
// // //               <div className="flex items-center gap-1">
// // //                 <div className="w-3 h-3 bg-gray-600 rounded"></div>
// // //                 <span>Text Only</span>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Position Stats */}
// // //           {slides.some(s => s.includeImage) && (
// // //             <div className="mt-4 pt-4 border-t border-gray-700">
// // //               <p className="text-gray-400 text-sm mb-2">Image Positions</p>
// // //               <div className="flex gap-4 text-sm">
// // //                 <div className="flex items-center gap-2">
// // //                   <span className="text-gray-400">Left:</span>
// // //                   <span className="text-white font-semibold">
// // //                     {slides.filter(s => s.imagePosition === "left" && s.includeImage).length}
// // //                   </span>
// // //                 </div>
// // //                 <div className="flex items-center gap-2">
// // //                   <span className="text-gray-400">Right:</span>
// // //                   <span className="text-white font-semibold">
// // //                     {slides.filter(s => s.imagePosition === "right" && s.includeImage).length}
// // //                   </span>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import CanvasAnimation from "./CanvasAnimation";

// // export default function SlidePreview({ slides }) {
// //   const getThemeStyles = (theme) => {
// //     switch (theme) {
// //       case "dark":
// //         return { background: "#1f2937", color: "#f9fafb", accent: "#60a5fa" };
// //       case "minimal":
// //         return { background: "#ffffff", color: "#111827", accent: "#3b82f6" };
// //       case "vibrant":
// //         return {
// //           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //           color: "#ffffff",
// //           accent: "#fbbf24",
// //         };
// //       case "creative":
// //         return {
// //           background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
// //           color: "#ffffff",
// //           accent: "#fde047",
// //         };
// //       case "professional":
// //       default:
// //         return {
// //           background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
// //           color: "#ffffff",
// //           accent: "#e0f2fe",
// //         };
// //     }
// //   };

// //   const presentationTheme = slides[0]?.theme || "professional";
// //   const themeStyles = getThemeStyles(presentationTheme);

// //   return (
// //     <div className="min-h-screen bg-gray-900 p-10">
// //       <div className="max-w-5xl mx-auto space-y-8">
// //         {/* Header */}
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h2 className="text-3xl font-bold text-white mb-2">
// //               Slide Preview
// //             </h2>
// //             <p className="text-gray-400 text-sm">
// //               {slides.length} slides • Theme:{" "}
// //               <span className="capitalize font-semibold">
// //                 {presentationTheme}
// //               </span>
// //             </p>
// //           </div>
// //           <div className="grid grid-cols-2 gap-4">
// //             <div className="bg-gray-800 px-4 py-2 rounded-lg text-center">
// //               <p className="text-xs text-gray-400">With Animations</p>
// //               <p className="text-2xl font-bold text-green-400">
// //                 {slides.filter((s) => s.hasAnimation).length}
// //               </p>
// //             </div>
// //             <div className="bg-gray-800 px-4 py-2 rounded-lg text-center">
// //               <p className="text-xs text-gray-400">With Images</p>
// //               <p className="text-2xl font-bold text-blue-400">
// //                 {slides.filter((s) => s.includeImage && s.image).length}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Slides */}
// //         {slides.map((s, i) => {
// //           const hasAnimation = s.hasAnimation && s.animationCode;
// //           const hasImage = s.image && s.includeImage && !hasAnimation;
// //           const imagePosition = s.imagePosition || "right";

// //           return (
// //             <div
// //               key={i}
// //               className="rounded-xl shadow-2xl overflow-hidden relative"
// //               style={{
// //                 background: themeStyles.background,
// //                 color: themeStyles.color,
// //                 minHeight: "450px",
// //               }}
// //             >
// //               <div className="relative z-10 p-10">
// //                 {/* Header with Slide Number */}
// //                 <div className="flex items-start justify-between mb-4">
// //                   <div className="flex-1">
// //                     <h3 className="text-4xl font-bold leading-tight mb-2">
// //                       {s.title}
// //                     </h3>
// //                   </div>
// //                   <div
// //                     className="text-sm px-3 py-1 rounded-lg ml-4"
// //                     style={{
// //                       backgroundColor: themeStyles.accent,
// //                       color:
// //                         presentationTheme === "minimal" ? "#111827" : "#000000",
// //                       opacity: 0.8,
// //                     }}
// //                   >
// //                     {i + 1} / {slides.length}
// //                   </div>
// //                 </div>

// //                 {/* Separator */}
// //                 <div
// //                   className="h-1 mb-6 rounded"
// //                   style={{ backgroundColor: themeStyles.accent }}
// //                 ></div>

// //                 {/* Content Layout Based on Animation/Image */}
// //                 {hasAnimation ? (
// //                   <div className="grid grid-cols-2 gap-8 items-start">
// //                     {/* Content on Left */}
// //                     <div className="order-1">
// //                       <p className="whitespace-pre-line text-lg leading-relaxed">
// //                         {s.content}
// //                       </p>
// //                     </div>

// //                     {/* Animation on Right */}
// //                     <div className="order-2">
// //                       <div className="bg-white rounded-lg p-2 shadow-xl">
// //                         <CanvasAnimation
// //                           animationCode={s.animationCode}
// //                           width={400}
// //                           height={300}
// //                         />
// //                       </div>
// //                       {s.animationDescription && (
// //                         <p
// //                           className="text-xs mt-3 italic text-center"
// //                           style={{ opacity: 0.7 }}
// //                         >
// //                           🎬 {s.animationDescription}
// //                         </p>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ) : hasImage ? (
// //                   <div className="grid grid-cols-2 gap-8 items-start">
// //                     {imagePosition === "left" ? (
// //                       <>
// //                         {/* Image on Left */}
// //                         <div className="order-1">
// //                           <img
// //                             src={s.image}
// //                             alt={s.imageKeyword || s.title}
// //                             className="rounded-lg w-full h-full object-cover shadow-lg"
// //                             style={{ maxHeight: "320px" }}
// //                           />
// //                           {s.imageKeyword && (
// //                             <p
// //                               className="text-xs mt-2 italic"
// //                               style={{ opacity: 0.6 }}
// //                             >
// //                               {s.imageKeyword}
// //                             </p>
// //                           )}
// //                         </div>
// //                         {/* Content on Right */}
// //                         <div className="order-2">
// //                           <p className="whitespace-pre-line text-lg leading-relaxed">
// //                             {s.content}
// //                           </p>
// //                         </div>
// //                       </>
// //                     ) : (
// //                       <>
// //                         {/* Content on Left */}
// //                         <div className="order-1">
// //                           <p className="whitespace-pre-line text-lg leading-relaxed">
// //                             {s.content}
// //                           </p>
// //                         </div>
// //                         {/* Image on Right */}
// //                         <div className="order-2">
// //                           <img
// //                             src={s.image}
// //                             alt={s.imageKeyword || s.title}
// //                             className="rounded-lg w-full h-full object-cover shadow-lg"
// //                             style={{ maxHeight: "320px" }}
// //                           />
// //                           {s.imageKeyword && (
// //                             <p
// //                               className="text-xs mt-2 italic text-right"
// //                               style={{ opacity: 0.6 }}
// //                             >
// //                               {s.imageKeyword}
// //                             </p>
// //                           )}
// //                         </div>
// //                       </>
// //                     )}
// //                   </div>
// //                 ) : (
// //                   // No Image/Animation - Full Width Content
// //                   <div className="max-w-4xl">
// //                     <p className="whitespace-pre-line text-lg leading-relaxed">
// //                       {s.content}
// //                     </p>
// //                   </div>
// //                 )}

// //                 {/* Footer Info */}
// //                 <div
// //                   className="mt-6 pt-4 flex items-center justify-between text-sm"
// //                   style={{
// //                     borderTop: `1px solid ${themeStyles.accent}`,
// //                     opacity: 0.6,
// //                   }}
// //                 >
// //                   <span>Slide {i + 1}</span>
// //                   {hasAnimation && (
// //                     <span className="flex items-center gap-2">
// //                       <svg
// //                         className="w-4 h-4"
// //                         fill="currentColor"
// //                         viewBox="0 0 20 20"
// //                       >
// //                         <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
// //                       </svg>
// //                       Animated
// //                     </span>
// //                   )}
// //                   {hasImage && (
// //                     <span className="flex items-center gap-2">
// //                       <svg
// //                         className="w-4 h-4"
// //                         fill="currentColor"
// //                         viewBox="0 0 20 20"
// //                       >
// //                         <path
// //                           fillRule="evenodd"
// //                           d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
// //                           clipRule="evenodd"
// //                         />
// //                       </svg>
// //                       Image: {imagePosition}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           );
// //         })}

// //         {/* Summary Card */}
// //         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
// //           <h3 className="text-xl font-bold text-white mb-4">
// //             Presentation Summary
// //           </h3>
// //           <div className="grid grid-cols-4 gap-6">
// //             <div>
// //               <p className="text-gray-400 text-sm mb-1">Total Slides</p>
// //               <p className="text-3xl font-bold text-white">{slides.length}</p>
// //             </div>
// //             <div>
// //               <p className="text-gray-400 text-sm mb-1">Theme</p>
// //               <p className="text-3xl font-bold text-white capitalize">
// //                 {presentationTheme}
// //               </p>
// //             </div>
// //             <div>
// //               <p className="text-gray-400 text-sm mb-1">Animations</p>
// //               <p className="text-3xl font-bold text-green-400">
// //                 {slides.filter((s) => s.hasAnimation).length}
// //               </p>
// //             </div>
// //             <div>
// //               <p className="text-gray-400 text-sm mb-1">With Images</p>
// //               <p className="text-3xl font-bold text-blue-400">
// //                 {slides.filter((s) => s.includeImage && s.image).length}
// //               </p>
// //             </div>
// //           </div>

// //           {/* Visual Distribution */}
// //           <div className="mt-6 pt-6 border-t border-gray-700">
// //             <p className="text-gray-400 text-sm mb-3">Visual Distribution</p>
// //             <div className="flex gap-2">
// //               {slides.map((s, i) => (
// //                 <div
// //                   key={i}
// //                   className={`flex-1 h-3 rounded ${
// //                     s.hasAnimation
// //                       ? "bg-green-500"
// //                       : s.includeImage && s.image
// //                       ? "bg-blue-500"
// //                       : "bg-gray-600"
// //                   }`}
// //                   title={`Slide ${i + 1}${
// //                     s.hasAnimation
// //                       ? " - Animation"
// //                       : s.includeImage
// //                       ? " - Image"
// //                       : " - Text only"
// //                   }`}
// //                 />
// //               ))}
// //             </div>
// //             <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
// //               <div className="flex items-center gap-1">
// //                 <div className="w-3 h-3 bg-green-500 rounded"></div>
// //                 <span>Animation</span>
// //               </div>
// //               <div className="flex items-center gap-1">
// //                 <div className="w-3 h-3 bg-blue-500 rounded"></div>
// //                 <span>Image</span>
// //               </div>
// //               <div className="flex items-center gap-1">
// //                 <div className="w-3 h-3 bg-gray-600 rounded"></div>
// //                 <span>Text Only</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import CanvasAnimation from "./CanvasAnimation";
// import ProgressTerminal from "./ProgressTerminal";
// import { useSSEProgress } from "../hooks/useSSEProgress";

// export default function SlidePreview({ slides, generationId, videoFilename }) {
//   const [showVideo, setShowVideo] = useState(false);
//   const { progress, status, message, logs } = useSSEProgress(generationId);

//   const getThemeStyles = (theme) => {
//     switch (theme) {
//       case "dark":
//         return { background: "#1f2937", color: "#f9fafb", accent: "#60a5fa" };
//       case "minimal":
//         return { background: "#ffffff", color: "#111827", accent: "#3b82f6" };
=======
// export default function SlidePreview({ slides }) {
//   const getThemeStyles = (theme) => {
//     switch (theme) {
//       case "dark":
//         return { 
//           background: "#1f2937", 
//           color: "#f9fafb",
//           accent: "#60a5fa"
//         };
//       case "minimal":
//         return { 
//           background: "#ffffff", 
//           color: "#111827",
//           accent: "#3b82f6"
//         };
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//       case "vibrant":
//         return {
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           color: "#ffffff",
<<<<<<< HEAD
//           accent: "#fbbf24",
=======
//           accent: "#fbbf24"
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//         };
//       case "creative":
//         return {
//           background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//           color: "#ffffff",
<<<<<<< HEAD
//           accent: "#fde047",
=======
//           accent: "#fde047"
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//         };
//       case "professional":
//       default:
//         return {
//           background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
//           color: "#ffffff",
<<<<<<< HEAD
//           accent: "#e0f2fe",
=======
//           accent: "#e0f2fe"
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//         };
//     }
//   };

<<<<<<< HEAD
//   const presentationTheme = slides[0]?.theme || "professional";
//   const themeStyles = getThemeStyles(presentationTheme);

//   // Video URL using filename only
//    const videoUrl = videoFilename
//     ? `http://localhost:8000/api/video/${videoFilename}`
//     : null;

//   console.log("🎥 SlidePreview - videoFilename:", videoFilename);
//   console.log("🎥 SlidePreview - Final videoUrl:", videoUrl);
=======
//   // All slides have the same theme
//   const presentationTheme = slides[0]?.theme || "professional";
//   const themeStyles = getThemeStyles(presentationTheme);

>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//   return (
//     <div className="min-h-screen bg-gray-900 p-10">
//       <div className="max-w-5xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-3xl font-bold text-white mb-2">
//               Slide Preview
//             </h2>
//             <p className="text-gray-400 text-sm">
<<<<<<< HEAD
//               {slides.length} slides • Theme:{" "}
//               <span className="capitalize font-semibold">
//                 {presentationTheme}
//               </span>
//             </p>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gray-800 px-4 py-2 rounded-lg text-center">
//               <p className="text-xs text-gray-400">With Animations</p>
//               <p className="text-2xl font-bold text-green-400">
//                 {slides.filter((s) => s.hasAnimation).length}
//               </p>
//             </div>
//             <div className="bg-gray-800 px-4 py-2 rounded-lg text-center">
//               <p className="text-xs text-gray-400">With Images</p>
//               <p className="text-2xl font-bold text-blue-400">
//                 {slides.filter((s) => s.includeImage && s.image).length}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Progress Terminal */}
//         {generationId && status !== 'completed' && (
//           <ProgressTerminal logs={logs} progress={progress} status={status} />
//         )}

//         {/* Video Player (shown when video is ready) */}
//         {videoUrl && status === 'completed' && (
//           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-bold text-white">
//                 📹 Final Video Preview
//               </h3>
//               <button
//                 onClick={() => setShowVideo(!showVideo)}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
//               >
//                 {showVideo ? (
//                   <>
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                     Hide Video
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                       <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                     </svg>
//                     Preview Video
//                   </>
//                 )}
//               </button>
//             </div>

//             {showVideo && (
//               <div className="relative bg-black rounded-lg overflow-hidden">
//                 <video
//                   controls
//                   className="w-full"
//                   preload="metadata"
//                   key={videoUrl}
//                 >
//                   <source src={videoUrl} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//                 <a
//                   href={videoUrl}
//                   download
//                   className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                   </svg>
//                   Download
//                 </a>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Slides */}
//         {slides.map((s, i) => {
//           const hasAnimation = s.hasAnimation && s.animationCode;
//           const hasImage = s.image && s.includeImage && !hasAnimation;
=======
//               {slides.length} slides • Theme: <span className="capitalize font-semibold">{presentationTheme}</span>
//             </p>
//           </div>
//           <div className="bg-gray-800 px-4 py-2 rounded-lg">
//             <p className="text-xs text-gray-400">Slides with images</p>
//             <p className="text-2xl font-bold text-white">
//               {slides.filter(s => s.includeImage && s.image).length}/{slides.length}
//             </p>
//           </div>
//         </div>

//         {/* Slides */}
//         {slides.map((s, i) => {
//           const hasImage = s.image && s.includeImage !== false;
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//           const imagePosition = s.imagePosition || "right";

//           return (
//             <div
//               key={i}
//               className="rounded-xl shadow-2xl overflow-hidden relative"
//               style={{
//                 background: themeStyles.background,
//                 color: themeStyles.color,
//                 minHeight: "450px",
//               }}
//             >
//               <div className="relative z-10 p-10">
//                 {/* Header with Slide Number */}
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex-1">
//                     <h3 className="text-4xl font-bold leading-tight mb-2">
//                       {s.title}
//                     </h3>
//                   </div>
<<<<<<< HEAD
//                   <div
//                     className="text-sm px-3 py-1 rounded-lg ml-4"
//                     style={{
//                       backgroundColor: themeStyles.accent,
//                       color:
//                         presentationTheme === "minimal" ? "#111827" : "#000000",
//                       opacity: 0.8,
=======
//                   <div 
//                     className="text-sm px-3 py-1 rounded-lg ml-4"
//                     style={{ 
//                       backgroundColor: themeStyles.accent,
//                       color: presentationTheme === "minimal" ? "#111827" : "#000000",
//                       opacity: 0.8
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//                     }}
//                   >
//                     {i + 1} / {slides.length}
//                   </div>
//                 </div>

<<<<<<< HEAD
//                 {/* Separator */}
//                 <div
=======
//                 {/* Blue separator */}
//                 <div 
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//                   className="h-1 mb-6 rounded"
//                   style={{ backgroundColor: themeStyles.accent }}
//                 ></div>

<<<<<<< HEAD
//                 {/* Content Layout Based on Animation/Image */}
//                 {hasAnimation ? (
//                   <div className="grid grid-cols-2 gap-8 items-start">
//                     {/* Content on Left */}
//                     <div className="order-1">
//                       <p className="whitespace-pre-line text-lg leading-relaxed">
//                         {s.content}
//                       </p>
//                     </div>

//                     {/* Animation on Right */}
//                     <div className="order-2">
//                       <div className="bg-white rounded-lg p-2 shadow-xl">
//                         <CanvasAnimation
//                           animationCode={s.animationCode}
//                           width={400}
//                           height={300}
//                         />
//                       </div>
//                       {s.animationDescription && (
//                         <p
//                           className="text-xs mt-3 italic text-center"
//                           style={{ opacity: 0.7 }}
//                         >
//                           🎬 {s.animationDescription}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ) : hasImage ? (
//                   <div className="grid grid-cols-2 gap-8 items-start">
=======
//                 {/* Content Layout Based on Image Position */}
//                 {hasImage ? (
//                   <div className="grid grid-cols-2 gap-8 items-start">
//                     {/* Left Side Content or Image */}
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//                     {imagePosition === "left" ? (
//                       <>
//                         {/* Image on Left */}
//                         <div className="order-1">
//                           <img
//                             src={s.image}
//                             alt={s.imageKeyword || s.title}
//                             className="rounded-lg w-full h-full object-cover shadow-lg"
//                             style={{ maxHeight: "320px" }}
//                           />
//                           {s.imageKeyword && (
<<<<<<< HEAD
//                             <p
=======
//                             <p 
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//                               className="text-xs mt-2 italic"
//                               style={{ opacity: 0.6 }}
//                             >
//                               {s.imageKeyword}
//                             </p>
//                           )}
//                         </div>
//                         {/* Content on Right */}
//                         <div className="order-2">
//                           <p className="whitespace-pre-line text-lg leading-relaxed">
//                             {s.content}
//                           </p>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         {/* Content on Left */}
//                         <div className="order-1">
//                           <p className="whitespace-pre-line text-lg leading-relaxed">
//                             {s.content}
//                           </p>
//                         </div>
//                         {/* Image on Right */}
//                         <div className="order-2">
//                           <img
//                             src={s.image}
//                             alt={s.imageKeyword || s.title}
//                             className="rounded-lg w-full h-full object-cover shadow-lg"
//                             style={{ maxHeight: "320px" }}
//                           />
//                           {s.imageKeyword && (
<<<<<<< HEAD
//                             <p
=======
//                             <p 
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//                               className="text-xs mt-2 italic text-right"
//                               style={{ opacity: 0.6 }}
//                             >
//                               {s.imageKeyword}
//                             </p>
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 ) : (
<<<<<<< HEAD
//                   // No Image/Animation - Full Width Content
=======
//                   // No Image - Full Width Content
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//                   <div className="max-w-4xl">
//                     <p className="whitespace-pre-line text-lg leading-relaxed">
//                       {s.content}
//                     </p>
//                   </div>
//                 )}

//                 {/* Footer Info */}
<<<<<<< HEAD
//                 <div
//                   className="mt-6 pt-4 flex items-center justify-between text-sm"
//                   style={{
//                     borderTop: `1px solid ${themeStyles.accent}`,
//                     opacity: 0.6,
//                   }}
//                 >
//                   <span>Slide {i + 1}</span>
//                   {hasAnimation && (
//                     <span className="flex items-center gap-2">
//                       <svg
//                         className="w-4 h-4"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
//                       </svg>
//                       Animated
//                     </span>
//                   )}
//                   {hasImage && (
//                     <span className="flex items-center gap-2">
//                       <svg
//                         className="w-4 h-4"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
//                           clipRule="evenodd"
//                         />
=======
//                 <div 
//                   className="mt-6 pt-4 flex items-center justify-between text-sm"
//                   style={{ 
//                     borderTop: `1px solid ${themeStyles.accent}`,
//                     opacity: 0.6
//                   }}
//                 >
//                   <span>Slide {i + 1}</span>
//                   {hasImage && (
//                     <span className="flex items-center gap-2">
//                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//                       </svg>
//                       Image: {imagePosition}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {/* Summary Card */}
//         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
<<<<<<< HEAD
//           <h3 className="text-xl font-bold text-white mb-4">
//             Presentation Summary
//           </h3>
//           <div className="grid grid-cols-4 gap-6">
=======
//           <h3 className="text-xl font-bold text-white mb-4">Presentation Summary</h3>
//           <div className="grid grid-cols-3 gap-6">
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//             <div>
//               <p className="text-gray-400 text-sm mb-1">Total Slides</p>
//               <p className="text-3xl font-bold text-white">{slides.length}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 text-sm mb-1">Theme</p>
<<<<<<< HEAD
//               <p className="text-3xl font-bold text-white capitalize">
//                 {presentationTheme}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-400 text-sm mb-1">Animations</p>
//               <p className="text-3xl font-bold text-green-400">
//                 {slides.filter((s) => s.hasAnimation).length}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-400 text-sm mb-1">With Images</p>
//               <p className="text-3xl font-bold text-blue-400">
//                 {slides.filter((s) => s.includeImage && s.image).length}
//               </p>
//             </div>
//           </div>

//           {/* Visual Distribution */}
//           <div className="mt-6 pt-6 border-t border-gray-700">
//             <p className="text-gray-400 text-sm mb-3">Visual Distribution</p>
=======
//               <p className="text-3xl font-bold text-white capitalize">{presentationTheme}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 text-sm mb-1">With Images</p>
//               <p className="text-3xl font-bold text-white">
//                 {slides.filter(s => s.includeImage && s.image).length}
//               </p>
//             </div>
//           </div>
          
//           {/* Image Distribution */}
//           <div className="mt-6 pt-6 border-t border-gray-700">
//             <p className="text-gray-400 text-sm mb-3">Image Distribution</p>
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//             <div className="flex gap-2">
//               {slides.map((s, i) => (
//                 <div
//                   key={i}
<<<<<<< HEAD
//                   className={`flex-1 h-3 rounded ${
//                     s.hasAnimation
//                       ? "bg-green-500"
//                       : s.includeImage && s.image
//                       ? "bg-blue-500"
//                       : "bg-gray-600"
//                   }`}
//                   title={`Slide ${i + 1}${
//                     s.hasAnimation
//                       ? " - Animation"
//                       : s.includeImage
//                       ? " - Image"
//                       : " - Text only"
//                   }`}
//                 />
//               ))}
//             </div>
//             <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-green-500 rounded"></div>
//                 <span>Animation</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-blue-500 rounded"></div>
//                 <span>Image</span>
=======
//                   className={`flex-1 h-2 rounded ${
//                     s.includeImage && s.image ? 'bg-green-500' : 'bg-gray-600'
//                   }`}
//                   title={`Slide ${i + 1}${s.includeImage ? ` - ${s.imagePosition}` : ' - No image'}`}
//                 />
//               ))}
//             </div>
//             <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-green-500 rounded"></div>
//                 <span>With Image</span>
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-gray-600 rounded"></div>
//                 <span>Text Only</span>
//               </div>
//             </div>
//           </div>
<<<<<<< HEAD
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
import { useState } from "react";
import CanvasAnimation from "./CanvasAnimation";
import ProgressTerminal from "./StepProgress";
import { useSSEProgress } from "../hooks/useSSEProgress";

export default function SlidePreview({ slides, generationId, videoFilename, scriptData }) {
  const [showVideo, setShowVideo] = useState(false);
  const { progress, status, logs, isConnected } = useSSEProgress(generationId, !!generationId);

=======

//           {/* Position Stats */}
//           {slides.some(s => s.includeImage) && (
//             <div className="mt-4 pt-4 border-t border-gray-700">
//               <p className="text-gray-400 text-sm mb-2">Image Positions</p>
//               <div className="flex gap-4 text-sm">
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-400">Left:</span>
//                   <span className="text-white font-semibold">
//                     {slides.filter(s => s.imagePosition === "left" && s.includeImage).length}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-400">Right:</span>
//                   <span className="text-white font-semibold">
//                     {slides.filter(s => s.imagePosition === "right" && s.includeImage).length}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import CanvasAnimation from "./CanvasAnimation";

export default function SlidePreview({ slides }) {
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
  const getThemeStyles = (theme) => {
    switch (theme) {
      case "dark":
        return { background: "#1f2937", color: "#f9fafb", accent: "#60a5fa" };
      case "minimal":
        return { background: "#ffffff", color: "#111827", accent: "#3b82f6" };
      case "vibrant":
        return {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#ffffff",
          accent: "#fbbf24",
        };
      case "creative":
        return {
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "#ffffff",
          accent: "#fde047",
        };
      case "professional":
      default:
        return {
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          color: "#ffffff",
          accent: "#e0f2fe",
        };
    }
  };

  const presentationTheme = slides[0]?.theme || "professional";
  const themeStyles = getThemeStyles(presentationTheme);

<<<<<<< HEAD
  // Video URL using filename only
  const videoUrl = videoFilename
    ? `http://localhost:8000/api/video/${videoFilename}`
    : null;

  console.log("🎥 SlidePreview - videoFilename:", videoFilename);
  console.log("🎥 SlidePreview - status:", status);
  console.log("🎥 SlidePreview - slides length:", slides.length);

  // Show loading state while generating
  const isGenerating = generationId && status !== 'completed' && status !== 'error';
  const isReady = status === 'completed' && slides.length > 0;

  // Format time helper
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Progress Terminal - Show while generating */}
        {isGenerating && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                🎬 Generating Your Presentation
              </h2>
              <p className="text-gray-400 text-sm">
                Please wait while we create your video...
              </p>
            </div>
            <ProgressTerminal 
              logs={logs} 
              progress={progress} 
              status={status}
              isConnected={isConnected}
            />
          </>
        )}

        {/* Content - Show only when ready */}
        {isReady && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Slide Preview
                </h2>
                <p className="text-gray-400 text-sm">
                  {slides.length} slides • Theme:{" "}
                  <span className="capitalize font-semibold">
                    {presentationTheme}
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 px-4 py-2 rounded-lg text-center">
                  <p className="text-xs text-gray-400">With Animations</p>
                  <p className="text-2xl font-bold text-green-400">
                    {slides.filter((s) => s.needs_animation).length}
                  </p>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg text-center">
                  <p className="text-xs text-gray-400">With Images</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {slides.filter((s) => s.needs_image).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Video Player (shown when video is ready) */}
            {videoUrl && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    📹 Final Video Preview
                  </h3>
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {showVideo ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Hide Video
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Preview Video
                      </>
                    )}
                  </button>
                </div>

                {showVideo && (
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full"
                      preload="metadata"
                      key={videoUrl}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <a
                      href={videoUrl}
                      download
                      className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Slide Timeline with Timestamps */}
            {scriptData?.slide_scripts && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">
                  ⏱️ Timeline & Narration
                </h3>
                <div className="space-y-3">
                  {scriptData.slide_scripts.map((slideScript, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-purple-400 font-semibold">
                          Slide {slideScript.slide_number}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {formatTime(slideScript.start_time)} - {formatTime(slideScript.end_time)}
                        </span>
                      </div>
                      <p className="text-white font-medium mb-2">
                        {slides[index]?.title}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {slideScript.narration_text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slides Preview */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white">📄 Slide Content</h3>
              {slides.map((s, i) => {
                const hasAnimation = s.needs_animation;
                const hasImage = s.needs_image && !hasAnimation;

                return (
                  <div
                    key={i}
                    className="rounded-xl shadow-2xl overflow-hidden relative"
                    style={{
                      background: themeStyles.background,
                      color: themeStyles.color,
                      minHeight: "450px",
                    }}
                  >
                    <div className="relative z-10 p-10">
                      {/* Header with Slide Number */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-4xl font-bold leading-tight mb-2">
                            {s.title}
                          </h3>
                        </div>
                        <div
                          className="text-sm px-3 py-1 rounded-lg ml-4"
                          style={{
                            backgroundColor: themeStyles.accent,
                            color: presentationTheme === "minimal" ? "#111827" : "#000000",
                            opacity: 0.8,
                          }}
                        >
                          {i + 1} / {slides.length}
                        </div>
                      </div>

                      {/* Separator */}
                      <div
                        className="h-1 mb-6 rounded"
                        style={{ backgroundColor: themeStyles.accent }}
                      ></div>

                      {/* Content */}
                      <div className="max-w-4xl">
                        <p className="whitespace-pre-line text-lg leading-relaxed">
                          {s.content_text}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div
                        className="mt-6 pt-4 flex items-center justify-between text-sm"
                        style={{
                          borderTop: `1px solid ${themeStyles.accent}`,
                          opacity: 0.6,
                        }}
                      >
                        <span>Slide {i + 1}</span>
                        <div className="flex gap-2">
                          {hasAnimation && (
                            <span className="flex items-center gap-2 bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                              Animation
                            </span>
                          )}
                          {hasImage && (
                            <span className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              Image: {s.image_keyword}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                Presentation Summary
              </h3>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Slides</p>
                  <p className="text-3xl font-bold text-white">{slides.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Duration</p>
                  <p className="text-3xl font-bold text-white">
                    {formatTime(scriptData?.total_duration)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Animations</p>
                  <p className="text-3xl font-bold text-green-400">
                    {slides.filter((s) => s.needs_animation).length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">With Images</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {slides.filter((s) => s.needs_image).length}
                  </p>
                </div>
              </div>

              {/* Visual Distribution */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm mb-3">Visual Distribution</p>
                <div className="flex gap-2">
                  {slides.map((s, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-3 rounded ${
                        s.needs_animation
                          ? "bg-green-500"
                          : s.needs_image
                          ? "bg-blue-500"
                          : "bg-gray-600"
                      }`}
                      title={`Slide ${i + 1}${
                        s.needs_animation
                          ? " - Animation"
                          : s.needs_image
                          ? " - Image"
                          : " - Text only"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Animation</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Image</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-600 rounded"></div>
                    <span>Text Only</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center py-16">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Generation Failed
            </h2>
            <p className="text-gray-400">
              Please go back and try again
            </p>
          </div>
        )}
=======
  return (
    <div className="min-h-screen bg-gray-900 p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Slide Preview
            </h2>
            <p className="text-gray-400 text-sm">
              {slides.length} slides • Theme:{" "}
              <span className="capitalize font-semibold">
                {presentationTheme}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-gray-400">With Animations</p>
              <p className="text-2xl font-bold text-green-400">
                {slides.filter((s) => s.hasAnimation).length}
              </p>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-gray-400">With Images</p>
              <p className="text-2xl font-bold text-blue-400">
                {slides.filter((s) => s.includeImage && s.image).length}
              </p>
            </div>
          </div>
        </div>

        {/* Slides */}
        {slides.map((s, i) => {
          const hasAnimation = s.hasAnimation && s.animationCode;
          const hasImage = s.image && s.includeImage && !hasAnimation;
          const imagePosition = s.imagePosition || "right";

          return (
            <div
              key={i}
              className="rounded-xl shadow-2xl overflow-hidden relative"
              style={{
                background: themeStyles.background,
                color: themeStyles.color,
                minHeight: "450px",
              }}
            >
              <div className="relative z-10 p-10">
                {/* Header with Slide Number */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-4xl font-bold leading-tight mb-2">
                      {s.title}
                    </h3>
                  </div>
                  <div
                    className="text-sm px-3 py-1 rounded-lg ml-4"
                    style={{
                      backgroundColor: themeStyles.accent,
                      color:
                        presentationTheme === "minimal" ? "#111827" : "#000000",
                      opacity: 0.8,
                    }}
                  >
                    {i + 1} / {slides.length}
                  </div>
                </div>

                {/* Separator */}
                <div
                  className="h-1 mb-6 rounded"
                  style={{ backgroundColor: themeStyles.accent }}
                ></div>

                {/* Content Layout Based on Animation/Image */}
                {hasAnimation ? (
                  <div className="grid grid-cols-2 gap-8 items-start">
                    {/* Content on Left */}
                    <div className="order-1">
                      <p className="whitespace-pre-line text-lg leading-relaxed">
                        {s.content}
                      </p>
                    </div>

                    {/* Animation on Right */}
                    <div className="order-2">
                      <div className="bg-white rounded-lg p-2 shadow-xl">
                        <CanvasAnimation
                          animationCode={s.animationCode}
                          width={400}
                          height={300}
                        />
                      </div>
                      {s.animationDescription && (
                        <p
                          className="text-xs mt-3 italic text-center"
                          style={{ opacity: 0.7 }}
                        >
                          🎬 {s.animationDescription}
                        </p>
                      )}
                    </div>
                  </div>
                ) : hasImage ? (
                  <div className="grid grid-cols-2 gap-8 items-start">
                    {imagePosition === "left" ? (
                      <>
                        {/* Image on Left */}
                        <div className="order-1">
                          <img
                            src={s.image}
                            alt={s.imageKeyword || s.title}
                            className="rounded-lg w-full h-full object-cover shadow-lg"
                            style={{ maxHeight: "320px" }}
                          />
                          {s.imageKeyword && (
                            <p
                              className="text-xs mt-2 italic"
                              style={{ opacity: 0.6 }}
                            >
                              {s.imageKeyword}
                            </p>
                          )}
                        </div>
                        {/* Content on Right */}
                        <div className="order-2">
                          <p className="whitespace-pre-line text-lg leading-relaxed">
                            {s.content}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Content on Left */}
                        <div className="order-1">
                          <p className="whitespace-pre-line text-lg leading-relaxed">
                            {s.content}
                          </p>
                        </div>
                        {/* Image on Right */}
                        <div className="order-2">
                          <img
                            src={s.image}
                            alt={s.imageKeyword || s.title}
                            className="rounded-lg w-full h-full object-cover shadow-lg"
                            style={{ maxHeight: "320px" }}
                          />
                          {s.imageKeyword && (
                            <p
                              className="text-xs mt-2 italic text-right"
                              style={{ opacity: 0.6 }}
                            >
                              {s.imageKeyword}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  // No Image/Animation - Full Width Content
                  <div className="max-w-4xl">
                    <p className="whitespace-pre-line text-lg leading-relaxed">
                      {s.content}
                    </p>
                  </div>
                )}

                {/* Footer Info */}
                <div
                  className="mt-6 pt-4 flex items-center justify-between text-sm"
                  style={{
                    borderTop: `1px solid ${themeStyles.accent}`,
                    opacity: 0.6,
                  }}
                >
                  <span>Slide {i + 1}</span>
                  {hasAnimation && (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      Animated
                    </span>
                  )}
                  {hasImage && (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Image: {imagePosition}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Summary Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">
            Presentation Summary
          </h3>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Slides</p>
              <p className="text-3xl font-bold text-white">{slides.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Theme</p>
              <p className="text-3xl font-bold text-white capitalize">
                {presentationTheme}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Animations</p>
              <p className="text-3xl font-bold text-green-400">
                {slides.filter((s) => s.hasAnimation).length}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">With Images</p>
              <p className="text-3xl font-bold text-blue-400">
                {slides.filter((s) => s.includeImage && s.image).length}
              </p>
            </div>
          </div>

          {/* Visual Distribution */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-3">Visual Distribution</p>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <div
                  key={i}
                  className={`flex-1 h-3 rounded ${
                    s.hasAnimation
                      ? "bg-green-500"
                      : s.includeImage && s.image
                      ? "bg-blue-500"
                      : "bg-gray-600"
                  }`}
                  title={`Slide ${i + 1}${
                    s.hasAnimation
                      ? " - Animation"
                      : s.includeImage
                      ? " - Image"
                      : " - Text only"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Animation</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Image</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-600 rounded"></div>
                <span>Text Only</span>
              </div>
            </div>
          </div>
        </div>
>>>>>>> 73529f5ab1bf7cdfe0e3f3b1627debd52ecd04fb
      </div>
    </div>
  );
}
