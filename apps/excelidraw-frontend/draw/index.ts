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
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export async function initdraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
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

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const height = e.clientX - startX;
    const width = e.clientY - startY;
    const shape = {
      type: "rect",
      x: startX,
      y: startY,
      height,
      width,
    };
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
  });
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const height = e.clientX - startX;
      const width = e.clientY - startY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      clearCanvas(existingShapes, canvas, ctx);

      //   ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

const getExistingShapes = async (roomId: string) => {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    // console.log("SHAPE h", res);
    const messages = res.data.chats;

    const shapes = messages.map((x: { message: string }) => {
      // console.log(x);
      const messageData = JSON.parse(x.message);
      // console.log(messageData);
      return messageData.shape;
    });

    return shapes;
  } catch (error) {
    console.log(error);
    return null;
  }
};
