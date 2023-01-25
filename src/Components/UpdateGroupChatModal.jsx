import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import { BsSearch } from 'react-icons/bs';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserBadgeItem from './UserBadgeItem.jsx';
import UserListItem from './UserListItem.jsx';

import { ChatState } from '../Context/ChatProvider.js';

import { useState } from "react";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '1px solid #11256D',
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};


export default function UpdateGroupChatModal({ open, handleClose, fetchMessages, fetchAgain, setFetchAgain }) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState();

  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  React.useEffect(() => {
    setGroupChatName(selectedChat?.chatName)
  }, [selectedChat])

  const handleSearch = async () => {
    if (!search) {
      toast("Search Input is Empty!", {
        type: "info"
      })
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
      // console.log(data)
    }
    catch (err) {
      toast("Error Occured", {
        type: "error"
      })
      setLoading(false);
      // console.log(err);
    }
  }


  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      // console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {

      toast("Error Occured!",{
        type: "error",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast("User Already in group!",{type:"info"})
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast("Only admins can add someone!",{
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast("Error Occured!",{
        type: "error",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if(selectedChat.users.length <= 3){
      toast("3 Users are Necessary for a Room!", {
        type: "info",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast("Only admins can remove someone!", {
        type: "error",
      });
      return;
    }
    
    if (selectedChat.groupAdmin._id === user._id) {
      toast("Admin Cannot be Removed!", {
        type: "error",
      });
      return;
    }
    

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      // console.log(error)
      toast("Error Occured!", {
        type: "error",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="search-user-modal"
        aria-describedby="search-user-modal"
      >
        <Box sx={style}>
          <TextField
            id="input-with-icon-textfield"
            placeholder='Room Name'
            className='w-full'
            inputProps={{
              style: {
                height: "40px",
                fontSize: "20px"
              },
            }}
            variant="standard"
            value={groupChatName}
            onChange={(e) => { setGroupChatName(e.target.value) }}
          />
          <div className='my-2'>
            List of Users
          </div>

          <div className='flex flex-wrap space-x-2'>
            {selectedChat?.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                currentUser={user}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </div>
          <div className='flex space-x-4 items-center mt-6'>
            <TextField
              id="input-with-icon-textfield"
              className='w-full'
              placeholder='Start Typing Name or Email to Add User !'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <BsSearch size={23} />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                style: {
                  height: "40px",
                  fontSize: "20px"
                },
              }}
              variant="standard"
              value={search}
              onChange={(e) => { setSearch(e.target.value) }}
            />
            <button type="submit" className="px-6 my-8 bg-[#11256D] text-center rounded-md text-white text-lg py-2 cursor-pointer"
              onClick={handleSearch}>
              Search
            </button>
          </div>

          {
            loading
              ?
              <Typography component="div" key={'h2'} variant={'h2'}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </Typography>
              :
              <div>
                {
                  searchResult && searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                      />
                    ))
                }
              </div>
          }

          <div className='bg-[#11256D] h-[0.1rem] rounded-full my-3'></div>
          <div className='flex justify-end'>
            <button className="text-lg text-white py-2 px-4 bg-[#11256D] rounded-md  cursor-pointer"
              onClick={handleRename}
            >
              Update Name Changes
            </button>
            <button className="ml-4 text-lg text-white py-2 px-4 bg-[#FF0000] rounded-md cursor-pointer"
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </button>
          </div>

        </Box>
      </Modal>
    </div>
  );
}
