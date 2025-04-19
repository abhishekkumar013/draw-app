import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export const getExistingShapes = async (roomId: string) => {
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
