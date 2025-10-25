import { useEffect, useRef } from 'react';

export default function CanvasAnimation({ animationCode, width = 800, height = 400 }) {
  const canvasRef = useRef(null);
  const frameCountRef = useRef(0);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !animationCode) return;

    const ctx = canvas.getContext('2d');
    
    // Create the animation function from Gemini's code
    let animateFunction;
    try {
      // Wrap the code in a function
      // The code should be function body only, we provide the wrapper
      const functionCode = `
        return function(ctx, canvas, frameCount) {
          try {
            ${animationCode}
          } catch (error) {
            console.error('Animation execution error:', error);
            ctx.fillStyle = '#EF4444';
            ctx.font = '16px Arial';
            ctx.fillText('Animation error: ' + error.message, 20, 30);
          }
        }
      `;
      
      animateFunction = new Function(functionCode)();
    } catch (error) {
      console.error('Error creating animation function:', error);
      // Show error on canvas
      ctx.fillStyle = '#EF4444';
      ctx.font = '16px Arial';
      ctx.fillText('Failed to load animation', 20, 30);
      ctx.font = '12px Arial';
      ctx.fillText(error.message, 20, 50);
      return;
    }

    // Animation loop
    const animate = () => {
      try {
        animateFunction(ctx, canvas, frameCountRef.current);
        frameCountRef.current++;
      } catch (error) {
        console.error('Animation runtime error:', error);
        // Stop animation on error
        cancelAnimationFrame(animationIdRef.current);
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      frameCountRef.current = 0;
    };
  }, [animationCode]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg border-2 border-gray-200 bg-white shadow-lg"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
