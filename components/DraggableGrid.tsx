import React, { useState, useEffect, useRef } from "react";
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
  const touchTargetRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    // Add non-passive touch event listeners to the grid wrapper
    const wrapper = touchTargetRef.current;
    if (wrapper) {
      wrapper.addEventListener(
        "touchmove",
        (e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const elements = document.elementsFromPoint(
            touch.clientX,
            touch.clientY
          );
          const cellElement = elements.find((el) =>
            el.classList.contains("grid-cell")
          );

          if (cellElement) {
            const index = parseInt(
              cellElement.getAttribute("data-index") || "-1"
            );
            if (index >= 0) {
              setDragOverIndex(index);
            }
          }
        },
        { passive: false }
      );
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("touchmove", (e) => e.preventDefault());
      }
    };
  }, []);

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (dragOverIndex !== null && window.draggedSVG) {
      const newCells = [...cells];
      newCells[dragOverIndex] = (
        <div dangerouslySetInnerHTML={{ __html: window.draggedSVG }} />
      );
      setCells(newCells);
      window.draggedSVG = null;
    }
    setDragOverIndex(null);
  };

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
      className="grid-wrapper"
      onTouchEnd={handleTouchEnd}
      ref={touchTargetRef}
    >
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
            data-index={index}
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
    </div>
  );
};
