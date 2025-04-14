"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hook/useSocket";

// interface ChatRoomProps {
//   message: string[];
//   id: string;
// }

interface SingleMessage {
  message: string;
}

interface ChatRoomProps {
  message: SingleMessage[];
  id: string;
}

const ChatRoomClient = ({
  messages,
  id,
}: {
  messages: {
    message: string;
  }[];
  id: string;
}) => {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMesssage] = useState("");
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );
      socket.onmessage = (event) => {
        const parseData = JSON.parse(event.data);
        // alert(parseData.message);

        if (parseData.type === "chat") {
          setChats((c) => [...c, { message: parseData.message }]);
        }
      };
    }
    // return () => {
    //   socket?.close();
    // };
  }, [loading, socket, id, chats]);
  // console.log("here", messages);

  return (
    <div>
      <div>
        {chats.map((m) => (
          <p key={m.id}>{m.message}</p>
        ))}
      </div>
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMesssage(e.target.value)}
        placeholder="type your message"
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              message: currentMessage,
              roomId: id,
            })
          );
          setCurrentMesssage("");
        }}
      >
        Send Message
      </button>
    </div>
  );
};

export default ChatRoomClient;
