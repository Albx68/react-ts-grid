import React, { useState, useEffect } from "react";
import "../styles/Grid.css";

interface GridProps {
  totalCells?: number;
  cellSize?: number;
  gap?: number;
}

export const DraggableGrid: React.FC<GridProps> = ({
  totalCells = 30,
  cellSize = 40,
  gap = 15,
}) => {
  const [columns, setColumns] = useState(10);
  const [cells, setCells] = useState<(React.ReactNode | null)[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const calculateLayout = () => {
      const screenWidth = window.innerWidth;
      let newColumns: number;

      if (screenWidth < 480) {
        // mobile
        newColumns = 3;
      } else if (screenWidth < 768) {
        // tablet
        newColumns = 5;
      } else if (screenWidth < 1024) {
        // small desktop
        newColumns = 6;
      } else {
        // large desktop
        newColumns = 10;
      }

      setColumns(newColumns);
      const rows = Math.ceil(totalCells / newColumns);
      setCells(Array(rows * newColumns).fill(null));
    };

    calculateLayout();
    window.addEventListener("resize", calculateLayout);

    return () => {
      window.removeEventListener("resize", calculateLayout);
    };
  }, [totalCells]);

  const handleDragOver = (
    e: React.DragEvent | React.TouchEvent,
    index: number
  ) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent | React.TouchEvent, index: number) => {
    e.preventDefault();
    let svgData: string | null = null;

    if ("dataTransfer" in e) {
      svgData = e.dataTransfer.getData("application/svg");
    } else if (window.draggedSVG) {
      svgData = window.draggedSVG;
      window.draggedSVG = null;
    }

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
    <div className="grid-wrapper">
      <div
        className="grid-container"
        style={{
          gap: `${gap}px`,
          gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        }}
      >
        {cells.slice(0, totalCells).map((cell, index) => (
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
            onTouchMove={(e) => handleDragOver(e, index)}
            onTouchEnd={(e) => handleDrop(e, index)}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};
