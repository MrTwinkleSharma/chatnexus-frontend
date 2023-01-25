import { ChatState } from '../Context/ChatProvider.js';
import axios from "axios";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { getSender } from '../config/ChatLogics.js';
import { MdGroups, MdSend } from 'react-icons/md';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import UpdateGroupChatModal from './UpdateGroupChatModal.jsx'
import { BiLoaderAlt } from 'react-icons/bi';
import io from "socket.io-client";
import ScrollableChat from './ScrollableChat.jsx'
import useChatScroll from '../Helpers/useChatScroll.jsx';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const ENDPOINT = process.env.REACT_APP_BACKEND_URL; 
var socket, selectedChatCompare;

const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
    },
});


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);
            // console.log(data);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/message`,
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                // console.log(data);
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        // console.log(user);
        socket.emit("setup", user);
    }, [user])
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const ref = useChatScroll(messages);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            // console.log("Current Typing will become true", typing);
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };
    return <>
        <UpdateGroupChatModal
            open={open}
            handleClose={handleClose}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            fetchMessages={fetchMessages}
        />
        {
            selectedChat ?
                <div className='h-full flex flex-col relative'>
                    <div className={`flex space-x-2 items-center p-3 ${selectedChat?.isGroupChat && 'justify-between mx-1'}`}>
                        {!selectedChat?.isGroupChat && <img className="w-12  h-12 rounded-full" src={user?.profilePicture} alt="profilePicture" />}

                        <div className='text-lg'>
                            {
                                !selectedChat?.isGroupChat ?
                                    (
                                        <>
                                            {getSender(user, selectedChat.users)}
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            {selectedChat?.chatName.toUpperCase()}
                                        </>
                                    )
                            }
                            <div>
                                {
                                    istyping && (
                                        "Typing..."
                                    )
                                }
                            </div>
                        </div>
                        {
                            selectedChat.isGroupChat &&
                            <>

                                <CustomWidthTooltip
                                    placement="bottom-start"
                                    TransitionComponent={Fade}
                                    TransitionProps={{ timeout: 600 }}
                                    title={<h1 className='text-[15px]'> Configure Group</h1>}
                                >
                                    <div className='mr-8 cursor-pointer'
                                        onClick={handleOpen}
                                    >
                                        <MdGroups size={32} className='text-[#11256D]' />
                                    </div>
                                </CustomWidthTooltip>
                            </>
                        }


                    </div>
                    <div className='rounded-t-lg bg-[#E0E0E0] overflow-y-auto m-3 mb-0 p-3 h-full'>
                        {
                            loading ?
                                <BiLoaderAlt className="h-full mx-auto text-[#11256D] animate-spin my-auto" size={60} />
                                :
                                <ScrollableChat ref={ref} messages={messages} isGroup={selectedChat?.isGroupChat} />
                        }

                    </div>

                    <TextField
                        id="input-with-icon-textfield"
                        placeholder='Enter a message...'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <MdSend className='text-[#11256D]' size={23} />
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            style: {
                                height: "35px",
                                fontSize: "15px",
                                outline:"none",
                                disableUnderline: true 
                            },

                        }}
                        autoComplete='off'
                        variant="standard"
                        value={newMessage}
                        onChange={typingHandler}
                        onKeyDown={sendMessage}
                        className='rounded-b-lg outline-none bg-[#E0E0E0] !border-[#11256D] !p-2 !m-3 !mt-0'
                    />
                    {/* <input
                        onKeyDown={sendMessage}
                        type="text"
                        className='rounded-b-lg outline-none bg-[#E0E0E0] p-2 m-3 mt-0'
                        placeholder="Enter a message..."
                        value={newMessage}
                        onChange={typingHandler}
                    /> */}
                </div>
                :
                <div className='flex items-center justify-center h-full'>
                    <h1 className=' text-3xl'>
                        Click on a Chat to Start Conversation
                    </h1>
                </div>

        }
    </>
}

export default SingleChat;