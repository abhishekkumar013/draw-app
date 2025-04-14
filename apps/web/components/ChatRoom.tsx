import axios from "axios";
import { BACKEND_URL } from "../config";
import ChatRoomClient from "./ChatRoomClient";

const getChats = async (roomId: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    // console.log("chats --->", response);

    return response.data.chats;
  } catch (error) {
    console.log(error);
  }
};

const ChatRoom = async ({ id }: { id: string }) => {
  const data = await getChats(id);
  console.log(data);

  return <ChatRoomClient id={id} messages={data} />;
};

export default ChatRoom;
