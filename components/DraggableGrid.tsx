import React, { useState } from "react";
import "../styles/Grid.css";

interface GridProps {
  rows?: number;
  columns?: number;
  cellSize?: number;
  gap?: number;
}

export const DraggableGrid: React.FC<GridProps> = ({
  rows = 3,
  columns = 3,
  cellSize = 100,
  gap = 10,
}) => {
  const [cells, setCells] = useState<(React.ReactNode | null)[]>(
    Array(rows * columns).fill(null)
  );
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const svgData = e.dataTransfer.getData("application/svg");
    if (svgData) {
      const newCells = [...cells];
      newCells[index] = <div dangerouslySetInnerHTML={{ __html: svgData }} />;
      setCells(newCells);
    }
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  return (
    <div
      className="grid-container"
      style={{
        gap: `${gap}px`,
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
      }}
    >
      {cells.map((cell, index) => (
        <div
          key={index}
          className={`grid-cell ${dragOverIndex === index ? "is-over" : ""}`}
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
          }}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragLeave={handleDragLeave}
        >
          {cell}
        </div>
      ))}
    </div>
  );
};
