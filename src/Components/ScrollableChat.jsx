import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages, isGroup }) => {
    const { user } = ChatState();
    // console.log(messages);
    return (
        <ScrollableFeed className="pr-2">
            {
                messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {
                            (isSameSender(messages, m, i, user._id) ||
                                isLastMessage(messages, i, user._id)) && (
                                <>

                                    <img
                                        style={{
                                            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                        }} className="w-8 h-8 border-[0.1rem] border-[#11256d] rounded-full" src={user.profilePicture} alt="profilePicture" />
                                </>

                            )
                        }
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                            }}
                        >
                            {
                                (isSameSender(messages, m, i, user._id) ||
                                    isLastMessage(messages, i, user._id)) && (isGroup &&
                                        <div className="text-[11px]">
                                            <u>{m?.sender?.name}</u>
                                        </div>
                                )
                            }
                            {m.content}
                        </span>
                    </div>
                ))
            }
        </ScrollableFeed>
    );
};

export default ScrollableChat;
