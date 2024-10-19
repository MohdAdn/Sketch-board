import React from "react";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import {
  faArrowRotateLeft,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { faEraser } from "@fortawesome/free-solid-svg-icons";

const Drawing = () => {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [range, setRange] = useState(1);
  const [color, setColor] = useState("#000000");
  const stageRef = useRef();

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    const newLine = {
      ...lastLine,
      points: lastLine.points.concat([point.x, point.y]),
    };

    setLines([...lines.slice(0, lines.length - 1), newLine]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    if (lines.length > 0) {
      setUndoStack((prev) => [...prev, lines]);
      setRedoStack([]);
    }
  };

  function handleUndo() {
    if (undoStack.length === 0) return;
    const lastState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, lines]);
    // setLines(lastState);
    setUndoStack((prev) => prev.slice(0, -1));
    setLines((prev) => prev.slice(0, -1));
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, lines]);
    setLines(nextState);
    setRedoStack((prev) => prev.slice(0, -1));
  }

  function handleExport() {
    const uri = stageRef.current.toDataURL();
    let link = document.createElement("a");
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <div className="icons-container">
        {/* Tool selection buttons */}
        <span>
          <FontAwesomeIcon
            className={tool === "pen" ? "pencil active" : "pencil"}
            icon={faPencil}
            onClick={() => setTool("pen")}
          />
        </span>
        <span>
          <FontAwesomeIcon
            className={tool === "eraser" ? "eraser active" : "eraser"}
            icon={faEraser}
            onClick={() => setTool("eraser")}
          />
        </span>
        <button onClick={handleUndo}>
          <span>
            <FontAwesomeIcon className="pencil" icon={faArrowRotateLeft} />
          </span>
        </button>

        <button onClick={handleRedo}>
          <span>
            <FontAwesomeIcon className="pencil" icon={faArrowRotateRight} />
          </span>
        </button>

        <span>
          <FontAwesomeIcon
            className="pencil"
            onClick={handleExport}
            icon={faDownload}
          />
        </span>
      </div>
      <div className="size-container">
        <label className="label" htmlFor="">
          Brush Size
        </label>
        <input
          type="range"
          className="input"
          onChange={(e) => setRange(e.target.value)}
          value={range}
          min={1}
          max={10}
        />
        <label>Brush Color</label>
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          value={color}
        />
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onPointerMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        onMouseup={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={color}
              strokeWidth={Number(range)}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Drawing;
