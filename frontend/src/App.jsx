import { useState } from "react";
import Home from "./components/Home";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  const [generatedData, setGeneratedData] = useState(null);
  const [view, setView] = useState("home");

  const handleGenerationComplete = (data) => {
    setGeneratedData(data);
    setView("player");
  };

  const handleBackToHome = () => {
    setView("home");
    setGeneratedData(null);
  };

  return (
    <div>
      {view === "home" && <Home onGenerationComplete={handleGenerationComplete} />}
      {view === "player" && generatedData && (
        <VideoPlayer 
          videoPath={generatedData.videoPath}
          content={generatedData.content}
          script={generatedData.script}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;
