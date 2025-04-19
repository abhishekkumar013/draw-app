import React, { useEffect, useRef, useState } from "react";
import { initdraw } from "@/draw";

import { Square, Circle, Minus } from "lucide-react";
// import { Game } from "@/draw/Game";

const toolIcons = {
  rect: <Square size={20} />,
  circle: <Circle size={20} />,
  line: <Minus size={20} />,
};

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedToolRef = useRef<"rect" | "circle" | "line">("rect");
  const [selectedTool, setSelectedTool] = useState<"rect" | "circle" | "line">(
    "rect"
  );

  // const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // useEffect(() => {
  //   setDimensions({ width: window.innerWidth, height: window.innerHeight });
  // }, []);

  // const [game, setGame] = useState<Game>();

  useEffect(() => {
    selectedToolRef.current = selectedTool;
    // game?.setTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    if (!canvasRef.current) return;
    let cleanup: (() => void) | undefined;

    const setup = async () => {
      cleanup = await initdraw(
        canvasRef.current!,
        roomId,
        socket,
        selectedToolRef
      );
    };

    setup();

    return () => {
      if (cleanup) cleanup();
    };

    // if (canvasRef.current) {
    //   const g = new Game(canvasRef.current, roomId, socket);
    //   setGame(g);
    // }
  }, [roomId, socket]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-800 rounded-lg p-2 flex space-x-2">
        {["rect", "circle", "line"].map((tool) => (
          <button
            key={tool}
            className={`p-2 rounded ${selectedTool === tool ? "bg-blue-600" : "bg-gray-300"}`}
            onClick={() => setSelectedTool(tool as any)}
          >
            {toolIcons[tool as "rect" | "circle" | "line"]}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          backgroundColor: "black",
          display: "block",
          width: "100vw",
          height: "100vh",
        }}
      ></canvas>
    </div>
  );
};

export default Canvas;
