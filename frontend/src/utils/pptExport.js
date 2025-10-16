

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

// Helper function to detect and parse table content
function parseTableContent(content) {
  const lines = content.split("\n").filter((line) => line.trim());

  // Check if it looks like a table (has pipes)
  const hasTableFormat = lines.some((line) => line.includes("|"));

  if (!hasTableFormat || lines.length < 2) {
    return null;
  }

  try {
    // Find separator line (contains dashes)
    const separatorIndex = lines.findIndex((line) => line.match(/^-+$/));

    if (separatorIndex === -1 || separatorIndex === 0) {
      return null;
    }

    const headerLine = lines[separatorIndex - 1];
    const dataLines = lines.slice(separatorIndex + 1);

    const headers = headerLine
      .split("|")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const rows = dataLines
      .map((line) =>
        line
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell.length > 0)
      )
      .filter((row) => row.length > 0);

    if (headers.length === 0 || rows.length === 0) {
      return null;
    }

    return { headers, rows };
  } catch (error) {
    console.error("Error parsing table:", error);
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

    // Check if this slide has an image
    const hasImage = s.includeImage === true && s.image;
    const imagePosition = s.imagePosition || "right";

    // Define layout dimensions based on image position
    let titleX, titleW, contentX, contentW, imageX;

    if (hasImage) {
      if (imagePosition === "left") {
        // Image on LEFT side
        imageX = 0.5;
        titleX = 4.2;
        titleW = 5.3;
        contentX = 4.2;
        contentW = 5.3;
      } else {
        // Image on RIGHT side (default)
        imageX = 5.8;
        titleX = 0.5;
        titleW = 5.0;
        contentX = 0.5;
        contentW = 5.0;
      }
    } else {
      // No image - full width
      titleX = 0.5;
      titleW = 9.0;
      contentX = 0.5;
      contentW = 9.0;
    }

    // Title with proper positioning
    slide.addText(s.title || "Untitled", {
      x: titleX,
      y: 0.5,
      w: titleW,
      h: 1.0,
      fontSize: 32,
      bold: true,
      color: textColor,
      fontFace: "Arial",
      fit: "shrink",
      wrap: true,
    });

    // Blue separator line (adjusted width based on layout)
    slide.addShape(pptx.ShapeType.rect, {
      x: titleX,
      y: 1.6,
      w: titleW,
      h: 0.05,
      fill: { color: "3B82F6" },
    });

    // Check if content is a table
    const tableData = parseTableContent(s.content);

    if (tableData) {
      // Add table to slide
      const tableRows = [
        tableData.headers.map((header) => ({
          text: header,
          options: {
            bold: true,
            fontSize: 12,
            color: textColor,
            fill: { color: "E5E7EB" },
          },
        })),
        ...tableData.rows.map((row) =>
          row.map((cell) => ({
            text: cell,
            options: {
              fontSize: 11,
              color: textColor,
            },
          }))
        ),
      ];

      slide.addTable(tableRows, {
        x: contentX,
        y: 2.0,
        w: contentW,
        colW: Array(tableData.headers.length).fill(
          contentW / tableData.headers.length
        ),
        border: { pt: 1, color: "CCCCCC" },
        align: "left",
        valign: "middle",
      });
    } else {
      // Regular content (text or bullets)
      // Dynamic font sizing based on content length
      let fontSize = 16;
      const contentLength = (s.content || "").length;

      if (contentLength > 800) fontSize = 11;
      else if (contentLength > 600) fontSize = 12;
      else if (contentLength > 400) fontSize = 14;

      // Add content with proper positioning
      slide.addText(s.content || "", {
        x: contentX,
        y: 2.0,
        w: contentW,
        h: 3.5,
        fontSize: fontSize,
        color: textColor,
        fontFace: "Arial",
        align: "left",
        valign: "top",
        fit: "shrink",
        wrap: true,
      });
    }

    // Add image with proper positioning (no overlap)
    if (hasImage) {
      const base64Image = await urlToBase64(s.image);
      if (base64Image) {
        slide.addImage({
          data: base64Image,
          x: imageX,
          y: 1.0,
          w: 3.5,
          h: 4.0,
          sizing: {
            type: "contain",
            w: 3.5,
            h: 4.0,
          },
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
