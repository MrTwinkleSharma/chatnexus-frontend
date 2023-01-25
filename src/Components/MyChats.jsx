import { Paper } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChatState } from "../Context/ChatProvider";
import { MdGroupAdd } from "react-icons/md";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { getSender } from "../config/ChatLogics.js";
import GroupChatModal from './GroupChatModal.jsx'

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        // console.log("User Changed");
        // console.log(user);

        if (user !== null && user != undefined) {
            // console.log("User is not null, Gonna call fetch chats");
            fetchChats();
        }
    }, [user])

    const fetchChats = async () => {
        // console.log("If User token is null or undefined, this call will raise an error", user?.token);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const { data } = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/chat`,
                config
            );
            setChats(data);
            // console.log(data);
        } catch (error) {
            // console.log(error)
            toast("Error Occured while Fetching Chats!", {
                type: "error",
            });
        }
    };
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        // fetchChats();
        // console.log("Chats Fetched")
        // eslint-disable-next-line
    }, [fetchAgain]);
    // console.log("List of chats", chats);
    return (
        <>
            <GroupChatModal open={open} handleClose={handleClose} />
            <Paper elevation={3} className="h-full">
                <div className="h-full p-4">
                    <div className="flex justify-between w-full items-center">
                        <div className="text-xl">My Chats</div>
                        <div className="text-lg text-white p-3 bg-[#11256D] rounded-md flex items-center space-x-3 cursor-pointer"
                            onClick={handleOpen}>
                            <div>New Room</div>
                            <MdGroupAdd size={27} />
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="overflow-y-auto">
                        {chats ? (
                            chats.map((chat) => {
                                // console.log(chat);
                                return (
                                    <div
                                        onClick={() => setSelectedChat(chat)}
                                        className={`cursor-pointer py-2 px-3 rounded-lg  my-2
                                        ${selectedChat == chat
                                                ? "bg-[#11256D] text-white"
                                                : "bg-[#E8E8E8] text-black"
                                            }`}
                                        key={chat._id}
                                    >
                                        <Typography>
                                            {!chat?.isGroupChat ? (getSender(loggedUser, chat?.users)) : chat?.chatName}
                                        </Typography>
                                        {/* {
                                            chat?.latestMessage ?
                                                <div className="">
                                                    <b>{chat?.latestMessage?.sender?.name}:</b> {chat?.latestMessage?.content}
                                                </div>
                                                :
                                                <i> No Messages Till Now</i>
                                        } */}
                                    </div>
                                );
                            })
                        ) : (
                            <Typography component="div" key={"h2"} variant={"h2"}>
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </Typography>
                        )}
                    </div>
                </div>
            </Paper>
        </>
    );
};

export default MyChats;
