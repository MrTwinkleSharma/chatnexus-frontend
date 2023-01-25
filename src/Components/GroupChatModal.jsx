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

export default function GroupChatModal({ open, handleClose }) {
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [groupChatName, setGroupChatName] = React.useState();
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

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
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {

      toast("Please fill all the fields", {
        type: "error"
      })
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      // console.log(chats);


      setChats([data, ...chats]);
      handleClose();


      toast("New Room Chat Created!", {
        type: "success"
      })
      setSelectedUsers([]);
      setGroupChatName("")
      setSearchResult([]);
      setSearch("");
    } catch (error) {

      // console.log(error);
      toast("Failed to Create the Room Chat!", {
        type: "error"
      })
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast("User already added!", {
        type: "warning"
      })

      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
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
          <h1 className='my-2 font-black'>List of Added Users</h1>

          <div className='flex flex-wrap space-x-2'>
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
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
            <button type="submit" className="px-6 my-3 bg-[#11256D] text-center rounded-md text-white text-lg py-2 cursor-pointer"
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
              <div className='overflow-y-auto'>
                {
                  searchResult && searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                }
              </div>
          }
          <div className='bg-[#11256D] h-[0.1rem] rounded-full my-3'></div>
          <div className='flex justify-end'>
            <button className="text-lg text-white py-2 px-4 bg-[#11256D] rounded-md  cursor-pointer"
              onClick={handleSubmit}
            >
              Create Room
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
