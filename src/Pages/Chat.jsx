import ChatSpace from "../Components/Chatbox";
import Navbar from "../Components/Navbar"
import MyChats from "../Components/MyChats";
import { ChatState } from "../Context/ChatProvider";
import { useState } from "react";

export const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return <div>
    <Navbar isLogin={true} />
    <div className="">
      <div className="flex h-[85vh] px-5 my-8 space-x-4">
        <div className="h-full w-[35%] ">
          <MyChats fetchAgain={fetchAgain} />
        </div>
        <div className="h-full w-[65%]">
          <ChatSpace fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </div>
    </div>
  </div>
}

export default Chat;

