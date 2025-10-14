
import PptxGenJs from "pptxgenjs";

// Helper function to convert image URL to base64
async function urlToBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
}

export const exportToPPT = async (slides) => {
  const pptx = new PptxGenJs();
  pptx.layout = "LAYOUT_16x9";

  for (let index = 0; index < slides.length; index++) {
    const s = slides[index];
    const slide = pptx.addSlide();
    
    const bgColor = s.theme === "dark" ? "1F2937" : "FFFFFF";
    const textColor = s.theme === "dark" ? "F9FAFB" : "111827";
    
    slide.background = { color: bgColor };
    
    // Title with shrink text option to prevent overflow
    slide.addText(s.title || "Untitled", {
      x: 0.5,
      y: 0.5,
      w: s.image && s.includeImage !== false ? 4.5 : 9,
      h: 1,
      fontSize: 32,
      bold: true,
      color: textColor,
      fontFace: "Arial",
      fit: "shrink",  // Automatically shrinks text to fit
      wrap: true,     // Enable text wrapping
    });
    
    // Blue separator line
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 1.6,
      w: s.image && s.includeImage !== false ? 4.5 : 9,
      h: 0.05,
      fill: { color: "3B82F6" },
    });
    
    // Dynamic font sizing based on content length
    let fontSize = 16;
    const contentLength = (s.content || "").length;
    
    if (contentLength > 800) fontSize = 11;
    else if (contentLength > 600) fontSize = 12;
    else if (contentLength > 400) fontSize = 14;
    
    // Add content with shrink option
    slide.addText(s.content || "", {
      x: 0.5,
      y: 2.0,
      w: s.image && s.includeImage !== false ? 4.5 : 9,
      h: 3.5,
      fontSize: fontSize,
      color: textColor,
      fontFace: "Arial",
      align: "left",
      valign: "top",
      fit: "shrink",  // Shrinks text if it overflows
      wrap: true,     // Enable text wrapping
    });
    
    // Add image with reduced size
    if (s.image && s.includeImage !== false) {
      const base64Image = await urlToBase64(s.image);
      if (base64Image) {
        slide.addImage({
          data: base64Image,
          x: 5.8,   // Moved slightly to right
          y: 1.0,   // Adjusted Y position
          w: 3.5,   // Reduced from 4.0
          h: 4.0,   // Reduced from 5.0
          sizing: { 
            type: 'contain',  // Better than 'cover' - fits entire image without cropping
            w: 3.5, 
            h: 4.0 
          }
        });
      }
    }
    
    // Slide number
    slide.addText(`${index + 1}`, {
      x: 9.5,
      y: 5.2,
      w: 0.5,
      h: 0.3,
      fontSize: 12,
      color: textColor,
    });
  }

  await pptx.writeFile({ fileName: "AI_Presentation.pptx" });
};
