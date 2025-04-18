import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export async function initdraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  selectedToolRef: React.RefObject<"rect" | "circle" | "line">
) {
  const ctx = canvas.getContext("2d");

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  clearCanvas(existingShapes, canvas, ctx);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  let clicked = false;
  let startX = 0;
  let startY = 0;

  // Clean up previous event listeners to prevent duplicates
  const mouseDownHandler = (e: MouseEvent) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  };

  const mouseUpHandler = (e: MouseEvent) => {
    if (!clicked) return;
    clicked = false;

    let shape: Shape;

    if (selectedToolRef.current === "rect") {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      };
    } else if (selectedToolRef.current === "circle") {
      const radius = Math.sqrt(
        Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2)
      );
      shape = {
        type: "circle",
        centerX: startX,
        centerY: startY,
        radius,
      };
    } else {
      // Line
      shape = {
        type: "line",
        startX,
        startY,
        endX: e.clientX,
        endY: e.clientY,
      };
    }

    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: roomId,
        message: JSON.stringify({
          shape,
        }),
      })
    );

    clearCanvas(existingShapes, canvas, ctx);
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!clicked) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearCanvas(existingShapes, canvas, ctx);

    if (selectedToolRef.current === "rect") {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      ctx.strokeRect(startX, startY, width, height);
    } else if (selectedToolRef.current === "circle") {
      const radius = Math.sqrt(
        Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2)
      );
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (selectedToolRef.current === "line") {
      // Line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    }
  };

  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);
  canvas.addEventListener("mousemove", mouseMoveHandler);

  // Return cleanup function
  return () => {
    canvas.removeEventListener("mousedown", mouseDownHandler);
    canvas.removeEventListener("mouseup", mouseUpHandler);
    canvas.removeEventListener("mousemove", mouseMoveHandler);
  };
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    ctx.strokeStyle = "rgba(255,255,255)";

    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    }
  });
}

const getExistingShapes = async (roomId: string) => {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.chats;

    const shapes = messages
      .map((x: { message: string }) => {
        try {
          const messageData = JSON.parse(x.message);
          return messageData.shape;
        } catch (e) {
          console.log("Error parsing shape:", e);
          return null;
        }
      })
      .filter(Boolean);

    return shapes;
  } catch (error) {
    console.log(error);
    return [];
  }
};
