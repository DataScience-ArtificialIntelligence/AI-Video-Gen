import { useState } from "react";
import Home from "./components/Home";
import SlideEditor from "./components/SlideEditor";
import SlidePreview from "./components/SlidePreview";
// import { exportToPPT } from "./utils/export";
import { exportToPPT } from "./utils/pptExport";

function App() {
  const [slides, setSlides] = useState([]);
  const [view, setView] = useState("home");

  const handleSlidesReady = (generatedSlides) => {
    setSlides(generatedSlides);
    setView("editor");
  };

  const handleExport = async () => {
  try {
    await exportToPPT(slides);
    // Optional: show success message
  } catch (error) {
    console.error("Export failed:", error);
    // Optional: show error message
  }
};

  return (
    <div>
      {view === "home" && <Home onSlidesReady={handleSlidesReady} />}
      {view === "editor" && (
        <div>
          <div className="flex gap-4 p-4 bg-gray-800 sticky top-0 z-10">
            <button
              onClick={() => setView("home")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              ← Back to Home
            </button>
            <button
              onClick={() => setView("preview")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Preview
            </button>
          </div>
          <SlideEditor slides={slides} setSlides={setSlides} onExport={handleExport} />
        </div>
      )}
      {view === "preview" && (
        <div>
          <div className="flex gap-4 p-4 bg-gray-800 sticky top-0 z-10">
            <button
              onClick={() => setView("editor")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              ← Back to Editor
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Export to PPT
            </button>
          </div>
          <SlidePreview slides={slides} />
        </div>
      )}
    </div>
  );
}

export default App;
