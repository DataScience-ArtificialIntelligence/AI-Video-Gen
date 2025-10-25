export default function VideoPlayer({ videoPath, content, script, onBack }) {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <h1 className="text-2xl font-bold text-white">
            {content?.topic || "Presentation"}
          </h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
              <video 
                controls 
                className="w-full"
                src={`http://localhost:8000/api/video/${videoPath.split('/').pop()}`}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-2">
                {content?.topic}
              </h2>
              <div className="flex gap-4 text-sm text-gray-300">
                <span>📊 {content?.total_slides} Slides</span>
                <span>⏱️ {script?.total_duration?.toFixed(1)}s</span>
                <span>🌐 {script?.language}</span>
              </div>
            </div>
          </div>

          {/* Slide Timeline */}
          <div className="bg-gray-800 rounded-xl p-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              📝 Slide Timeline
            </h3>
            <div className="space-y-3">
              {script?.slide_scripts?.map((slide, index) => (
                <div 
                  key={index}
                  className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-purple-400 font-semibold text-sm">
                      Slide {slide.slide_number}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {slide.start_time.toFixed(1)}s - {slide.end_time.toFixed(1)}s
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium mb-1">
                    {content?.slides?.[index]?.title}
                  </p>
                  <p className="text-gray-300 text-xs line-clamp-2">
                    {slide.narration_text}
                  </p>
                  
                  {/* Media indicators */}
                  <div className="flex gap-2 mt-2">
                    {content?.slides?.[index]?.needs_animation && (
                      <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded">
                        🎬 Animation
                      </span>
                    )}
                    {content?.slides?.[index]?.needs_image && (
                      <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
                        🖼️ Image
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Details */}
        <div className="mt-6 bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            📄 Slide Content
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content?.slides?.map((slide, index) => (
              <div 
                key={index}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
              >
                <div className="text-purple-400 font-semibold text-sm mb-2">
                  Slide {slide.slide_number}
                </div>
                <h4 className="text-white font-semibold mb-2">
                  {slide.title}
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  {slide.content_text}
                </p>
                <div className="flex flex-wrap gap-2">
                  {slide.needs_animation && (
                    <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded">
                      🎨 {slide.animation_description?.substring(0, 20)}...
                    </span>
                  )}
                  {slide.needs_image && (
                    <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
                      🖼️ {slide.image_keyword}
                    </span>
                  )}
                  <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
                    ⏱️ {slide.duration}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
