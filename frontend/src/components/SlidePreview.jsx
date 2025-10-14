export default function SlidePreview({ slides }) {
  return (
    <div className="min-h-screen bg-gray-900 p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-white mb-8">Preview</h2>
        {slides.map((s, i) => (
          <div
            key={i}
            className="rounded-xl shadow-2xl overflow-hidden"
            style={{
              background: s.theme === "dark" ? "#1f2937" : "#ffffff",
              color: s.theme === "dark" ? "#f9fafb" : "#111827",
            }}
          >
            <div className="p-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-4xl font-bold">{s.title}</h3>
                <span className="text-sm opacity-60">Slide {i + 1}</span>
              </div>
              <div className="h-1 bg-blue-500 mb-6 rounded"></div>
              
              <div className={`grid ${s.image && s.includeImage !== false ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
                <div>
                  <p className="whitespace-pre-line text-lg leading-relaxed">
                    {s.content}
                  </p>
                </div>
                {s.image && s.includeImage !== false && (
                  <div>
                    <img
                      src={s.image}
                      alt={s.title}
                      className="rounded-lg w-full h-full object-cover shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
