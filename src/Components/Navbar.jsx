import { useNavigate } from "react-router-dom";
import { AiOutlineArrowDown } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import { useEffect, useState } from "react";
import SearchModal from "./SearchModal";
import NotificationsMenu from "./NotificationsMenu.jsx";

import { ChatState } from "../Context/ChatProvider";
import ProfileMenu from "./ProfileMenu";


const Navbar = ({ isLogin, handleFeatureClick }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();




    return <>
        <SearchModal open={open} handleClose={handleClose} />
        <div className="bg-[#11256D] static">
            <div className="flex justify-between">
                <div className="text-white text-2xl m-5 cursor-pointer">
                    ChatNexus
                </div>
                <div className="flex items-center">
                    {
                        isLogin ?
                            <>
                                <div className="text-white m-3 text-lg">
                                    <div className="cursor-pointer flex  bg-white text-[#11256D] justify-center items-center outline-none px-4 py-2 rounded-md  "
                                        onClick={handleOpen}
                                    >
                                        <div className="mr-2">
                                            <BsSearch />
                                        </div>
                                        <p className="mr-12"
                                            onClick={() => {
                                            }}
                                        >
                                            Search User
                                        </p>
                                    </div>

                                </div>
                                <NotificationsMenu />
                                <div className="text-white m-3 text-lg">
                                    <ProfileMenu user={user} />
                                </div>
                            </>
                            :
                            <div className="text-white m-3 text-lg">
                                <div className="cursor-pointer flex hover:translate-y-2 hover:bg-white hover:text-[#11256D] duration-300 justify-center items-center border-2 px-4 py-2 rounded-lg  ">
                                    <p className="mr-2"
                                        onClick={handleFeatureClick}>
                                        Features
                                    </p>
                                    <AiOutlineArrowDown className=" " size={24} />
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    </>
}

export default Navbar;