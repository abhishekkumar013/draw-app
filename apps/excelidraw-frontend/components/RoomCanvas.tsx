"use client";

import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { WS_URL } from "@/config";

const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);

      const data = JSON.stringify({
        type: "join_room",
        roomId,
      });
      // console.log(data);
      ws.send(data);
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server....</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
};

export default RoomCanvas;
