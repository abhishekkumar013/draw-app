import axios from "axios";
import { BACKEND_URL } from "../../../config";
import ChatRoom from "../../../components/ChatRoom";

interface PropsType {
  params: {
    slug: string;
  };
}

const getRoom = async (slug: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    // console.log("room data", response);

    return response.data.room.id;
  } catch (error) {
    console.log("room error", error.messages);
  }
};

const Page = async ({ params }: PropsType) => {
  const parseParms = await params;
  const slug = parseParms.slug;

  const roomId = await getRoom(slug);

  return <ChatRoom id={roomId} />;
};

export default Page;
