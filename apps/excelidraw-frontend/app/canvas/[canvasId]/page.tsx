"use client";
import { initdraw } from "@/draw";
import React, { useEffect, useRef } from "react";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      initdraw(canvas);
    }
  }, [canvasRef]);

  return (
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
  );
};

export default Canvas;
