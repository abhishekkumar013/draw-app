import { useEffect, useState } from "react";
import { WEBSOCKET_URL } from "../config";

const useSocket = () => {
  const [loading, setLoading] = useState();
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WEBSOCKET_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhMjc4YWViLTBmYzQtNDVkNy1hN2U5LTU2NzUxZDVmMTM4NyIsImlhdCI6MTc0NDYxODkxMSwiZXhwIjoxNzQ1MjIzNzExfQ.YQde4_onf3b5y7EySgtbuFzaKhXWoTs4NH04ZK4KhSw`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    socket,
    loading,
  };
};

export { useSocket };
