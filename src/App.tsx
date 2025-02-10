import React, { useState, useEffect } from "react";
import { DraggableGrid } from "../components/DraggableGrid";
import "../styles/GridExample.css";

// Add this to make TypeScript happy with our global variable
declare global {
  interface Window {
    draggedSVG: string | null;
  }
}

function App() {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Add non-passive touch event listeners to the draggable elements
    const elements = document.getElementsByClassName("draggable-svg");
    Array.from(elements).forEach((element) => {
      element.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
        },
        { passive: false }
      );
    });

    return () => {
      // Clean up event listeners
      Array.from(elements).forEach((element) => {
        element.removeEventListener("touchstart", (e) => e.preventDefault());
      });
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, svg: string) => {
    e.dataTransfer.setData("application/svg", svg);
  };

  const handleTouchStart = (e: React.TouchEvent, svg: string) => {
    window.draggedSVG = svg;
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const sampleSVGs = [
    `<svg width="50" height="50" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>`,
    `<svg width="50" height="50" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="red"/></svg>`,
    `<svg width="50" height="50" viewBox="0 0 100 100"><polygon points="50,20 80,80 20,80" fill="green"/></svg>`,
  ];

  return (
    <div className="app">
      <header>
        <h1>SVG Grid Example</h1>
      </header>

      <main>
        <div className={`container ${isDragging ? "is-dragging" : ""}`}>
          <div className="svg-palette">
            {sampleSVGs.map((svg, index) => (
              <div
                key={index}
                className="draggable-svg"
                draggable
                onDragStart={(e) => handleDragStart(e, svg)}
                onTouchStart={(e) => handleTouchStart(e, svg)}
                onTouchEnd={handleTouchEnd}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ))}
          </div>

          <DraggableGrid totalCells={30} cellSize={40} gap={15} />
        </div>
      </main>
    </div>
  );
}

export default App;
