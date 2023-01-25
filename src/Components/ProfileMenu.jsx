import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import ProfileModal from "./ProfileModal";

export default function BasicMenu({ user }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigator = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigator("/");
    };
    const [profileOpen, setProfileOpen] = React.useState(false);
    const handleProfileOpen = () => setProfileOpen(true);
    const handleProfileClose = () => setProfileOpen(false);

    return (<>
        <ProfileModal user={user} handleProfileClose={handleProfileClose} profileOpen={profileOpen} handleClose={handleClose}/>
        <div>
            <div
                className='cursor-pointer'
                onClick={handleClick}
            >
                <img className='w-10 h-10 rounded-full' src={user?.profilePicture} alt="" />

            </div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleProfileOpen}>Profile</MenuItem>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </Menu>
        </div>
    </>
    );
}