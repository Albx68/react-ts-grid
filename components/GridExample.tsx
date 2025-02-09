import React from "react";
import { DraggableGrid } from "./DraggableGrid";
import "../styles/GridExample.css";

export const GridExample: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, svg: string) => {
    e.dataTransfer.setData("application/svg", svg);
  };

  const sampleSVGs = [
    `<svg width="50" height="50" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>`,
    `<svg width="50" height="50" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="red"/></svg>`,
    `<svg width="50" height="50" viewBox="0 0 100 100"><polygon points="50,20 80,80 20,80" fill="green"/></svg>`,
  ];

  return (
    <div className="container">
      <div className="svg-palette">
        {sampleSVGs.map((svg, index) => (
          <div
            key={index}
            className="draggable-svg"
            draggable
            onDragStart={(e) => handleDragStart(e, svg)}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ))}
      </div>

      <DraggableGrid rows={4} columns={4} cellSize={120} gap={15} />
    </div>
  );
};
