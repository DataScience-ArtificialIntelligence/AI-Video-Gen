
export default function SlidePreview({ slides }) {
  const getThemeStyles = (theme) => {
    switch (theme) {
      case "dark":
        return { 
          background: "#1f2937", 
          color: "#f9fafb",
          accent: "#60a5fa"
        };
      case "minimal":
        return { 
          background: "#ffffff", 
          color: "#111827",
          accent: "#3b82f6"
        };
      case "vibrant":
        return {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#ffffff",
          accent: "#fbbf24"
        };
      case "creative":
        return {
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "#ffffff",
          accent: "#fde047"
        };
      case "professional":
      default:
        return {
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          color: "#ffffff",
          accent: "#e0f2fe"
        };
    }
  };

  // All slides have the same theme
  const presentationTheme = slides[0]?.theme || "professional";
  const themeStyles = getThemeStyles(presentationTheme);

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
              {slides.length} slides • Theme: <span className="capitalize font-semibold">{presentationTheme}</span>
            </p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <p className="text-xs text-gray-400">Slides with images</p>
            <p className="text-2xl font-bold text-white">
              {slides.filter(s => s.includeImage && s.image).length}/{slides.length}
            </p>
          </div>
        </div>

        {/* Slides */}
        {slides.map((s, i) => {
          const hasImage = s.image && s.includeImage !== false;
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
                      color: presentationTheme === "minimal" ? "#111827" : "#000000",
                      opacity: 0.8
                    }}
                  >
                    {i + 1} / {slides.length}
                  </div>
                </div>

                {/* Blue separator */}
                <div 
                  className="h-1 mb-6 rounded"
                  style={{ backgroundColor: themeStyles.accent }}
                ></div>

                {/* Content Layout Based on Image Position */}
                {hasImage ? (
                  <div className="grid grid-cols-2 gap-8 items-start">
                    {/* Left Side Content or Image */}
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
                  // No Image - Full Width Content
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
                    opacity: 0.6
                  }}
                >
                  <span>Slide {i + 1}</span>
                  {hasImage && (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
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
          <h3 className="text-xl font-bold text-white mb-4">Presentation Summary</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Slides</p>
              <p className="text-3xl font-bold text-white">{slides.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Theme</p>
              <p className="text-3xl font-bold text-white capitalize">{presentationTheme}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">With Images</p>
              <p className="text-3xl font-bold text-white">
                {slides.filter(s => s.includeImage && s.image).length}
              </p>
            </div>
          </div>
          
          {/* Image Distribution */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-3">Image Distribution</p>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded ${
                    s.includeImage && s.image ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                  title={`Slide ${i + 1}${s.includeImage ? ` - ${s.imagePosition}` : ' - No image'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>With Image</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-600 rounded"></div>
                <span>Text Only</span>
              </div>
            </div>
          </div>

          {/* Position Stats */}
          {slides.some(s => s.includeImage) && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Image Positions</p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Left:</span>
                  <span className="text-white font-semibold">
                    {slides.filter(s => s.imagePosition === "left" && s.includeImage).length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Right:</span>
                  <span className="text-white font-semibold">
                    {slides.filter(s => s.imagePosition === "right" && s.includeImage).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
