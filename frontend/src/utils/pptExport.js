

// import PptxGenJs from "pptxgenjs";

// // Helper function to convert image URL to base64
// async function urlToBase64(url) {
//   try {
//     const response = await fetch(url);
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error("Error converting image to base64:", error);
//     return null;
//   }
// }

// // Helper function to detect and parse table content
// function parseTableContent(content) {
//   const lines = content.split("\n").filter((line) => line.trim());

//   // Check if it looks like a table (has pipes)
//   const hasTableFormat = lines.some((line) => line.includes("|"));

//   if (!hasTableFormat || lines.length < 2) {
//     return null;
//   }

//   try {
//     // Find separator line (contains dashes)
//     const separatorIndex = lines.findIndex((line) => line.match(/^-+$/));

//     if (separatorIndex === -1 || separatorIndex === 0) {
//       return null;
//     }

//     const headerLine = lines[separatorIndex - 1];
//     const dataLines = lines.slice(separatorIndex + 1);

//     const headers = headerLine
//       .split("|")
//       .map((h) => h.trim())
//       .filter((h) => h.length > 0);

//     const rows = dataLines
//       .map((line) =>
//         line
//           .split("|")
//           .map((cell) => cell.trim())
//           .filter((cell) => cell.length > 0)
//       )
//       .filter((row) => row.length > 0);

//     if (headers.length === 0 || rows.length === 0) {
//       return null;
//     }

//     return { headers, rows };
//   } catch (error) {
//     console.error("Error parsing table:", error);
//     return null;
//   }
// }

// export const exportToPPT = async (slides) => {
//   const pptx = new PptxGenJs();
//   pptx.layout = "LAYOUT_16x9";

//   for (let index = 0; index < slides.length; index++) {
//     const s = slides[index];
//     const slide = pptx.addSlide();

//     const bgColor = s.theme === "dark" ? "1F2937" : "FFFFFF";
//     const textColor = s.theme === "dark" ? "F9FAFB" : "111827";

//     slide.background = { color: bgColor };

//     // Check if this slide has an image
//     const hasImage = s.includeImage === true && s.image;
//     const imagePosition = s.imagePosition || "right";

//     // Define layout dimensions based on image position
//     let titleX, titleW, contentX, contentW, imageX;

//     if (hasImage) {
//       if (imagePosition === "left") {
//         // Image on LEFT side
//         imageX = 0.5;
//         titleX = 4.2;
//         titleW = 5.3;
//         contentX = 4.2;
//         contentW = 5.3;
//       } else {
//         // Image on RIGHT side (default)
//         imageX = 5.8;
//         titleX = 0.5;
//         titleW = 5.0;
//         contentX = 0.5;
//         contentW = 5.0;
//       }
//     } else {
//       // No image - full width
//       titleX = 0.5;
//       titleW = 9.0;
//       contentX = 0.5;
//       contentW = 9.0;
//     }

//     // Title with proper positioning
//     slide.addText(s.title || "Untitled", {
//       x: titleX,
//       y: 0.5,
//       w: titleW,
//       h: 1.0,
//       fontSize: 32,
//       bold: true,
//       color: textColor,
//       fontFace: "Arial",
//       fit: "shrink",
//       wrap: true,
//     });

//     // Blue separator line (adjusted width based on layout)
//     slide.addShape(pptx.ShapeType.rect, {
//       x: titleX,
//       y: 1.6,
//       w: titleW,
//       h: 0.05,
//       fill: { color: "3B82F6" },
//     });

//     // Check if content is a table
//     const tableData = parseTableContent(s.content);

//     if (tableData) {
//       // Add table to slide
//       const tableRows = [
//         tableData.headers.map((header) => ({
//           text: header,
//           options: {
//             bold: true,
//             fontSize: 12,
//             color: textColor,
//             fill: { color: "E5E7EB" },
//           },
//         })),
//         ...tableData.rows.map((row) =>
//           row.map((cell) => ({
//             text: cell,
//             options: {
//               fontSize: 11,
//               color: textColor,
//             },
//           }))
//         ),
//       ];

//       slide.addTable(tableRows, {
//         x: contentX,
//         y: 2.0,
//         w: contentW,
//         colW: Array(tableData.headers.length).fill(
//           contentW / tableData.headers.length
//         ),
//         border: { pt: 1, color: "CCCCCC" },
//         align: "left",
//         valign: "middle",
//       });
//     } else {
//       // Regular content (text or bullets)
//       // Dynamic font sizing based on content length
//       let fontSize = 16;
//       const contentLength = (s.content || "").length;

//       if (contentLength > 800) fontSize = 11;
//       else if (contentLength > 600) fontSize = 12;
//       else if (contentLength > 400) fontSize = 14;

//       // Add content with proper positioning
//       slide.addText(s.content || "", {
//         x: contentX,
//         y: 2.0,
//         w: contentW,
//         h: 3.5,
//         fontSize: fontSize,
//         color: textColor,
//         fontFace: "Arial",
//         align: "left",
//         valign: "top",
//         fit: "shrink",
//         wrap: true,
//       });
//     }

//     // Add image with proper positioning (no overlap)
//     if (hasImage) {
//       const base64Image = await urlToBase64(s.image);
//       if (base64Image) {
//         slide.addImage({
//           data: base64Image,
//           x: imageX,
//           y: 1.0,
//           w: 3.5,
//           h: 4.0,
//           sizing: {
//             type: "contain",
//             w: 3.5,
//             h: 4.0,
//           },
//         });
//       }
//     }

//     // Slide number
//     slide.addText(`${index + 1}`, {
//       x: 9.5,
//       y: 5.2,
//       w: 0.5,
//       h: 0.3,
//       fontSize: 12,
//       color: textColor,
//     });
//   }

//   await pptx.writeFile({ fileName: "AI_Presentation.pptx" });
// };
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

// Helper function to capture canvas animation as GIF
async function captureCanvasAnimationAsGif(animationCode) {
  return new Promise(async (resolve) => {
    try {
      // Dynamically import GIF.js
      const GIF = (await import('gif.js')).default;
      
      // Create temporary canvas
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      // Create animation function
      let animateFunction;
      try {
        const functionCode = `
          return function(ctx, canvas, frameCount) {
            ${animationCode}
          }
        `;
        animateFunction = new Function(functionCode)();
      } catch (error) {
        console.error('Error creating animation function:', error);
        resolve(null);
        return;
      }
      
      // Initialize GIF encoder
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 800,
        height: 400,
        workerScript: '/gif.worker.js',
        repeat: 0, // Loop forever
      });
      
      // Capture frames (3 seconds at 20fps = 60 frames)
      const totalFrames = 60;
      const delay = 50; // 50ms = 20fps
      
      console.log('📹 Capturing animation frames...');
      
      for (let frame = 0; frame < totalFrames; frame++) {
        try {
          // Clear and render frame
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          animateFunction(ctx, canvas, frame);
          
          // Add frame to GIF
          gif.addFrame(ctx, { copy: true, delay: delay });
        } catch (error) {
          console.error(`Error rendering frame ${frame}:`, error);
        }
      }
      
      // Render GIF
      gif.on('finished', async (blob) => {
        console.log('✅ GIF rendering complete');
        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
      
      gif.on('progress', (progress) => {
        console.log(`GIF progress: ${Math.round(progress * 100)}%`);
      });
      
      gif.render();
    } catch (error) {
      console.error('Error capturing animation:', error);
      resolve(null);
    }
  });
}

// Helper function to detect and parse table content
function parseTableContent(content) {
  const lines = content.split("\n").filter((line) => line.trim());
  const hasTableFormat = lines.some((line) => line.includes("|"));

  if (!hasTableFormat || lines.length < 2) {
    return null;
  }

  try {
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

  console.log(`\n🚀 Starting PPT export for ${slides.length} slides...`);

  for (let index = 0; index < slides.length; index++) {
    const s = slides[index];
    const slide = pptx.addSlide();

    console.log(`\n📄 Processing slide ${index + 1}: ${s.title}`);

    const bgColor = s.theme === "dark" ? "1F2937" : "FFFFFF";
    const textColor = s.theme === "dark" ? "F9FAFB" : "111827";

    slide.background = { color: bgColor };

    // Check for animation or image
    const hasAnimation = s.hasAnimation === true && s.animationCode;
    const hasImage = s.includeImage === true && s.image && !hasAnimation;
    const hasVisual = hasAnimation || hasImage;
    const imagePosition = s.imagePosition || "right";

    // Define layout dimensions
    let titleX, titleW, contentX, contentW, visualX;

    if (hasVisual) {
      if (hasAnimation || imagePosition === "left") {
        // Visual on LEFT side
        visualX = 0.5;
        titleX = 4.2;
        titleW = 5.3;
        contentX = 4.2;
        contentW = 5.3;
      } else {
        // Visual on RIGHT side (default)
        visualX = 5.8;
        titleX = 0.5;
        titleW = 5.0;
        contentX = 0.5;
        contentW = 5.0;
      }
    } else {
      // No visual - full width
      titleX = 0.5;
      titleW = 9.0;
      contentX = 0.5;
      contentW = 9.0;
    }

    // Title
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

    // Blue separator line
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
            align: "center",
            valign: "middle",
          },
        })),
        ...tableData.rows.map((row) =>
          row.map((cell) => ({
            text: cell,
            options: {
              fontSize: 11,
              color: textColor,
              align: "left",
              valign: "middle",
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
        margin: 0.1,
      });
    } else {
      // Regular content (text or bullets)
      // Dynamic font sizing based on content length
      let fontSize = 16;
      const contentLength = (s.content || "").length;
      if (contentLength > 800) fontSize = 11;
      else if (contentLength > 600) fontSize = 12;
      else if (contentLength > 400) fontSize = 14;

      // Add content text
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

    // Handle Animation (convert to GIF)
    if (hasAnimation) {
      console.log(`   🎬 Rendering animation for slide ${index + 1}...`);
      try {
        const gifBase64 = await captureCanvasAnimationAsGif(s.animationCode);
        
        if (gifBase64) {
          slide.addImage({
            data: gifBase64,
            x: visualX,
            y: 1.0,
            w: 3.5,
            h: 4.0,
            sizing: {
              type: "contain",
              w: 3.5,
              h: 4.0,
            },
          });
          console.log(`   ✅ Animation GIF added successfully`);
        } else {
          console.log(`   ⚠️ Failed to generate animation GIF`);
          // Add placeholder text
          slide.addText("⚠️ Animation preview\n(render failed)", {
            x: visualX,
            y: 2.5,
            w: 3.5,
            h: 1.0,
            fontSize: 14,
            color: "EF4444",
            align: "center",
            valign: "middle",
          });
        }
      } catch (error) {
        console.error(`   ❌ Error processing animation:`, error);
      }
    }

    // Handle Static Image
    if (hasImage) {
      console.log(`   🖼️ Adding image for slide ${index + 1}...`);
      try {
        const base64Image = await urlToBase64(s.image);
        if (base64Image) {
          slide.addImage({
            data: base64Image,
            x: visualX,
            y: 1.0,
            w: 3.5,
            h: 4.0,
            sizing: {
              type: "contain",
              w: 3.5,
              h: 4.0,
            },
          });
          console.log(`   ✅ Image added successfully`);
        } else {
          console.log(`   ⚠️ Failed to load image`);
        }
      } catch (error) {
        console.error(`   ❌ Error adding image:`, error);
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
      align: "right",
    });
  }

  // Save the presentation
  console.log(`\n💾 Saving presentation...`);
  await pptx.writeFile({ fileName: "AI_Presentation.pptx" });
  console.log(`✅ Presentation exported successfully!\n`);
};
