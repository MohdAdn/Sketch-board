import React from "react";
import { useState, useRef } from "react";
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
  const [range, setRange] = useState(1);
  const [color, setColor] = useState("#000000");
  const stageRef = useRef();

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  function handleRedo() {}
  function handleUndo() {}

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
        <span>
          <FontAwesomeIcon
            className="pencil"
            icon={faPencil}
            onClick={() => setTool("pen")}
          />
        </span>
        <span>
          <FontAwesomeIcon
            className="pencil"
            icon={faEraser}
            onClick={() => setTool("eraser")}
          />
        </span>
        <span>
          <FontAwesomeIcon className="pencil" icon={faArrowRotateLeft} />
        </span>
        <span>
          <FontAwesomeIcon className="pencil" icon={faArrowRotateRight} />
        </span>
        <span>
          <FontAwesomeIcon
            className="pencil"
            onClick={handleExport}
            icon={faDownload}
          />
        </span>
      </div>
      <div className="size-container">
        <label htmlFor="">Brush Size</label>
        <input
          type="range"
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
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
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
