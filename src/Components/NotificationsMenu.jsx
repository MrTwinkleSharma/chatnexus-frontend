import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ChatState } from '../Context/ChatProvider';
import { getSender } from '../config/ChatLogics';
import { MdNotificationsActive } from 'react-icons/md';

import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
export default function BasicMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();
    // console.log(notification);
    return (
        <div className='mx-3'>
            <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
            />
            <MdNotificationsActive className="text-white" size={33}
                cursor="pointer"
                onClick={handleClick}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {!notification.length && <i className='px-5'>No New Notifications</i>}
                {notification.map((notif) => (
                    <MenuItem
                        key={notif._id}
                        onClick={() => {
                            setSelectedChat(notif.chat);
                            setNotification(notification.filter((n) => n !== notif));
                            handleClose();
                        }}
                        c
                    >
                        {
                            notif.chat.isGroupChat
                                ? `New Message in ${notif.chat.chatName}`
                                : `New Message from ${getSender(user, notif.chat.users)}`}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}