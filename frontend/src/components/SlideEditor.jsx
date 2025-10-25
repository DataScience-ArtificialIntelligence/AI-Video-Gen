
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { useState } from "react";

// export default function SlideEditor({ slides, setSlides, onExport }) {
//   const [exporting, setExporting] = useState(false);

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const reordered = Array.from(slides);
//     const [moved] = reordered.splice(result.source.index, 1);
//     reordered.splice(result.destination.index, 0, moved);
//     setSlides(reordered);
//   };

//   const toggleImage = (index) => {
//     const updated = [...slides];
//     updated[index].includeImage = !updated[index].includeImage;
//     setSlides(updated);
//   };

//   const deleteSlide = (index) => {
//     if (slides.length <= 1) {
//       alert("Cannot delete the last slide");
//       return;
//     }
//     const updated = slides.filter((_, i) => i !== index);
//     setSlides(updated);
//   };

//   const handleExport = async () => {
//     setExporting(true);
//     try {
//       await onExport();
//     } catch (error) {
//       alert("Error exporting presentation");
//       console.error(error);
//     }
//     setExporting(false);
//   };

//   const getContentStatus = (content, hasImage) => {
//     const maxLength = hasImage ? 600 : 800;
//     const length = content.length;

//     if (length > maxLength) {
//       return {
//         color: "text-red-600",
//         message: "⚠ Content too long - may overflow",
//       };
//     } else if (length > maxLength * 0.8) {
//       return {
//         color: "text-yellow-600",
//         message: "⚡ Content nearing limit",
//       };
//     }
//     return { color: "text-green-600", message: "✓ Content fits well" };
//   };

//   // Get theme info - all slides have same theme
//   const presentationTheme = slides[0]?.theme || "professional";

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-5xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-800">Edit Your Slides</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Theme: <span className="font-semibold capitalize">{presentationTheme}</span>
//               {" "}- Applied to all slides
//             </p>
//           </div>
//           <button
//             onClick={handleExport}
//             disabled={exporting}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {exporting ? (
//               <>
//                 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
//                 Exporting...
//               </>
//             ) : (
//               <>
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
//                   />
//                 </svg>
//                 Export to PPT
//               </>
//             )}
//           </button>
//         </div>

//         <DragDropContext onDragEnd={handleDragEnd}>
//           <Droppable droppableId="slides">
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 className="space-y-4"
//               >
//                 {slides.map((s, i) => {
//                   const hasImage = s.image && s.includeImage !== false;
//                   const contentStatus = getContentStatus(s.content, hasImage);

//                   return (
//                     <Draggable key={i} draggableId={`${i}`} index={i}>
//                       {(provided, snapshot) => (
//                         <div
//                           {...provided.draggableProps}
//                           ref={provided.innerRef}
//                           className={`bg-white rounded-xl shadow-lg border-2 transition-all ${
//                             snapshot.isDragging
//                               ? "border-blue-500 shadow-2xl"
//                               : "border-gray-200"
//                           }`}
//                         >
//                           <div
//                             {...provided.dragHandleProps}
//                             className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-t-xl flex items-center justify-between"
//                           >
//                             <div className="flex items-center gap-3">
//                               <svg
//                                 className="w-5 h-5 cursor-move"
//                                 fill="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z" />
//                               </svg>
//                               <span className="font-semibold">
//                                 Slide {i + 1}
//                               </span>
//                               {hasImage && (
//                                 <span className="text-xs bg-white/20 px-2 py-1 rounded capitalize">
//                                   Image: {s.imagePosition || "right"}
//                                 </span>
//                               )}
//                             </div>
//                             <button
//                               onClick={() => deleteSlide(i)}
//                               className="hover:bg-red-500 p-2 rounded-lg transition-colors"
//                             >
//                               <svg
//                                 className="w-5 h-5"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                 />
//                               </svg>
//                             </button>
//                           </div>

//                           <div className="p-6 space-y-4">
//                             {/* Title Input */}
//                             <div>
//                               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Title{" "}
//                                 {s.title.length > 60 && (
//                                   <span className="text-red-600">
//                                     (Too long!)
//                                   </span>
//                                 )}
//                               </label>
//                               <input
//                                 className={`w-full text-2xl font-bold border-2 rounded-lg p-3 focus:outline-none ${
//                                   s.title.length > 60
//                                     ? "border-red-500"
//                                     : "border-gray-300 focus:border-blue-500"
//                                 }`}
//                                 value={s.title}
//                                 onChange={(e) => {
//                                   const updated = [...slides];
//                                   updated[i].title = e.target.value;
//                                   setSlides(updated);
//                                 }}
//                                 placeholder="Slide title..."
//                                 maxLength={80}
//                               />
//                             </div>

//                             {/* Content Input */}
//                             <div>
//                               <div className="flex justify-between items-center mb-2">
//                                 <label className="block text-sm font-semibold text-gray-700">
//                                   Content
//                                 </label>
//                                 <span
//                                   className={`text-xs font-semibold ${contentStatus.color}`}
//                                 >
//                                   {contentStatus.message} ({s.content.length}{" "}
//                                   chars)
//                                 </span>
//                               </div>
//                               <textarea
//                                 className={`w-full border-2 rounded-lg p-3 focus:outline-none resize-none font-mono text-sm ${
//                                   s.content.length > (hasImage ? 600 : 800)
//                                     ? "border-red-500"
//                                     : "border-gray-300 focus:border-blue-500"
//                                 }`}
//                                 rows={8}
//                                 value={s.content}
//                                 onChange={(e) => {
//                                   const updated = [...slides];
//                                   updated[i].content = e.target.value;
//                                   setSlides(updated);
//                                 }}
//                                 placeholder="Slide content... (Use • for bullets, | for tables)"
//                               />
//                               <p className="text-xs text-gray-500 mt-1">
//                                 Tip: Use bullet points (•) or table format (|)
//                                 for structured content
//                               </p>
//                             </div>

//                             {/* Image Settings */}
//                             <div className="border-t pt-4">
//                               <div className="flex items-center justify-between mb-3">
//                                 <label className="text-sm font-semibold text-gray-700">
//                                   Image {hasImage && `(Position: ${s.imagePosition || "right"})`}
//                                 </label>
//                                 <label className="flex items-center cursor-pointer">
//                                   <input
//                                     type="checkbox"
//                                     checked={s.includeImage !== false && s.image}
//                                     onChange={() => toggleImage(i)}
//                                     className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                                   />
//                                   <span className="ml-2 text-sm text-gray-600">
//                                     Include in PPT
//                                   </span>
//                                 </label>
//                               </div>

//                               {s.image && (
//                                 <div className="space-y-3">
//                                   {/* Image Preview */}
//                                   <img
//                                     src={s.image}
//                                     alt="Preview"
//                                     className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
//                                   />

//                                   {/* Image URL Input */}
//                                   <div>
//                                     <label className="block text-xs font-semibold text-gray-600 mb-2">
//                                       Image URL (edit to replace)
//                                     </label>
//                                     <input
//                                       type="text"
//                                       placeholder="https://example.com/image.jpg"
//                                       className="w-full border-2 border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none"
//                                       value={s.image}
//                                       onChange={(e) => {
//                                         const updated = [...slides];
//                                         updated[i].image = e.target.value;
//                                         setSlides(updated);
//                                       }}
//                                     />
//                                   </div>

//                                   {/* Image Info */}
//                                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                                     <div className="flex items-start gap-2">
//                                       <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                                       </svg>
//                                       <div className="text-xs text-blue-800">
//                                         <p className="font-semibold">AI-Selected Position: {s.imagePosition || "right"}</p>
//                                         {s.imageKeyword && (
//                                           <p className="mt-1">Search keyword: "{s.imageKeyword}"</p>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}

//                               {!s.image && (
//                                 <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
//                                   <p className="text-sm text-gray-500">
//                                     No image for this slide
//                                   </p>
//                                   <p className="text-xs text-gray-400 mt-1">
//                                     AI determined this slide doesn't need an image
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </Draggable>
//                   );
//                 })}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </div>
//     </div>
//   );
// }
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import CanvasAnimation from "./CanvasAnimation";

export default function SlideEditor({ slides, setSlides, onExport }) {
  const [exporting, setExporting] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(slides);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSlides(reordered);
  };

  const toggleImage = (index) => {
    const updated = [...slides];
    updated[index].includeImage = !updated[index].includeImage;
    setSlides(updated);
  };

  const toggleAnimation = (index) => {
    const updated = [...slides];
    if (updated[index].hasAnimation) {
      // Store the code before disabling
      if (!updated[index]._animationCodeBackup && updated[index].animationCode) {
        updated[index]._animationCodeBackup = updated[index].animationCode;
      }
      updated[index].hasAnimation = false;
    } else {
      // Restore from backup
      if (updated[index]._animationCodeBackup) {
        updated[index].animationCode = updated[index]._animationCodeBackup;
        updated[index].hasAnimation = true;
      }
    }
    setSlides(updated);
  };

  const deleteSlide = (index) => {
    if (slides.length <= 1) {
      alert("Cannot delete the last slide");
      return;
    }
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExport();
    } catch (error) {
      alert("Error exporting presentation");
      console.error(error);
    }
    setExporting(false);
  };

  const getContentStatus = (content, hasVisual) => {
    const maxLength = hasVisual ? 600 : 800;
    const length = content.length;
    if (length > maxLength) {
      return {
        color: "text-red-600",
        message: "⚠ Content too long - may overflow",
      };
    } else if (length > maxLength * 0.8) {
      return {
        color: "text-yellow-600",
        message: "⚡ Content nearing limit",
      };
    }
    return { color: "text-green-600", message: "✓ Content fits well" };
  };

  const presentationTheme = slides[0]?.theme || "professional";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Edit Your Slides</h2>
            <p className="text-sm text-gray-600 mt-1">
              Theme:{" "}
              <span className="font-semibold capitalize">{presentationTheme}</span>{" "}
              - Applied to all slides
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <>
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
                Exporting...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Export to PPT
              </>
            )}
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="slides">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {slides.map((s, i) => {
                  const hasAnimation = s.hasAnimation && s.animationCode;
                  const hasImage = s.image && s.includeImage !== false && !hasAnimation;
                  const hasVisual = hasAnimation || hasImage;
                  const contentStatus = getContentStatus(s.content, hasVisual);

                  return (
                    <Draggable key={i} draggableId={`${i}`} index={i}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className={`bg-white rounded-xl shadow-lg border-2 transition-all ${
                            snapshot.isDragging
                              ? "border-blue-500 shadow-2xl"
                              : "border-gray-200"
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-t-xl flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <svg
                                className="w-5 h-5 cursor-move"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z" />
                              </svg>
                              <span className="font-semibold">Slide {i + 1}</span>
                              {hasAnimation && (
                                <span className="text-xs bg-green-500/30 px-2 py-1 rounded flex items-center gap-1">
                                  🎬 Animation
                                </span>
                              )}
                              {hasImage && (
                                <span className="text-xs bg-white/20 px-2 py-1 rounded capitalize">
                                  🖼️ Image: {s.imagePosition || "right"}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => deleteSlide(i)}
                              className="hover:bg-red-500 p-2 rounded-lg transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="p-6 space-y-4">
                            {/* Title Input */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title{" "}
                                {s.title.length > 60 && (
                                  <span className="text-red-600">(Too long!)</span>
                                )}
                              </label>
                              <input
                                className={`w-full text-2xl font-bold border-2 rounded-lg p-3 focus:outline-none ${
                                  s.title.length > 60
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-blue-500"
                                }`}
                                value={s.title}
                                onChange={(e) => {
                                  const updated = [...slides];
                                  updated[i].title = e.target.value;
                                  setSlides(updated);
                                }}
                                placeholder="Slide title..."
                                maxLength={80}
                              />
                            </div>

                            {/* Content Input */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                  Content
                                </label>
                                <span
                                  className={`text-xs font-semibold ${contentStatus.color}`}
                                >
                                  {contentStatus.message} ({s.content.length} chars)
                                </span>
                              </div>
                              <textarea
                                className={`w-full border-2 rounded-lg p-3 focus:outline-none resize-none font-mono text-sm ${
                                  s.content.length > (hasVisual ? 600 : 800)
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-blue-500"
                                }`}
                                rows={8}
                                value={s.content}
                                onChange={(e) => {
                                  const updated = [...slides];
                                  updated[i].content = e.target.value;
                                  setSlides(updated);
                                }}
                                placeholder="Slide content... (Use • for bullets, | for tables)"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Tip: Use bullet points (•) or table format (|) for
                                structured content
                              </p>
                            </div>

                            {/* Animation Section */}
                            {(s.animationCode || s._animationCodeBackup) && (
                              <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-3">
                                  <label className="text-sm font-semibold text-gray-700">
                                    Animation
                                  </label>
                                  <label className="flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={hasAnimation}
                                      onChange={() => toggleAnimation(i)}
                                      className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                      Include in PPT
                                    </span>
                                  </label>
                                </div>

                                {hasAnimation && (
                                  <div className="space-y-3">
                                    {/* Animation Preview */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <CanvasAnimation
                                        animationCode={s.animationCode}
                                        width={400}
                                        height={250}
                                      />
                                    </div>

                                    {/* Animation Info */}
                                    {s.animationDescription && (
                                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-sm text-green-800">
                                          🎬 {s.animationDescription}
                                        </p>
                                      </div>
                                    )}

                                    {/* Animation Code (collapsed by default) */}
                                    <details className="bg-gray-100 rounded-lg">
                                      <summary className="p-3 cursor-pointer text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg">
                                        View/Edit Animation Code
                                      </summary>
                                      <textarea
                                        className="w-full border-2 border-gray-300 rounded-lg p-3 mt-2 font-mono text-xs focus:outline-none focus:border-blue-500"
                                        rows={10}
                                        value={s.animationCode}
                                        onChange={(e) => {
                                          const updated = [...slides];
                                          updated[i].animationCode = e.target.value;
                                          setSlides(updated);
                                        }}
                                        placeholder="Animation JavaScript code..."
                                      />
                                    </details>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Image Section (only if no animation) */}
                            {!hasAnimation && (
                              <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-3">
                                  <label className="text-sm font-semibold text-gray-700">
                                    Image{" "}
                                    {hasImage && `(Position: ${s.imagePosition || "right"})`}
                                  </label>
                                  <label className="flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={s.includeImage !== false && s.image}
                                      onChange={() => toggleImage(i)}
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                      Include in PPT
                                    </span>
                                  </label>
                                </div>

                                {s.image && (
                                  <div className="space-y-3">
                                    {/* Image Preview */}
                                    <img
                                      src={s.image}
                                      alt="Preview"
                                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                                    />

                                    {/* Image URL Input */}
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                                        Image URL (edit to replace)
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full border-2 border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none"
                                        value={s.image}
                                        onChange={(e) => {
                                          const updated = [...slides];
                                          updated[i].image = e.target.value;
                                          setSlides(updated);
                                        }}
                                      />
                                    </div>

                                    {/* Image Info */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                      <div className="flex items-start gap-2">
                                        <svg
                                          className="w-4 h-4 text-blue-600 mt-0.5"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <div className="text-xs text-blue-800">
                                          <p className="font-semibold">
                                            Position: {s.imagePosition || "right"}
                                          </p>
                                          {s.imageKeyword && (
                                            <p className="mt-1">
                                              Search keyword: "{s.imageKeyword}"
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {!s.image && (
                                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <p className="text-sm text-gray-500">
                                      No image for this slide
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      AI determined this slide doesn't need an image
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
