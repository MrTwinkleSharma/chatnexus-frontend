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
import UserListItem from './UserListItem';
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
  p: 2,

};


export default function SearchModal({ open, handleClose }) {
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

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

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        "Content-type": "appplication/json"
      }

      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, { userId }, config);
      // console.log(data);
      if (!chats?.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setLoading(false);
      setSelectedChat(data);
      handleClose();
    }
    catch (err) {
      toast("Error Occured", {
        type: "error"
      })
      setLoading(false);
      // console.log(err);
    }
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="search-user-modal"
        aria-describedby="search-user-modal"
      >
        <Box sx={style}>

          <div className='flex space-x-4 items-center p-1'>
            <CustomWidthTooltip
              placement="top-start"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title={<h1 className='text-[15px]'>Start Typing Name or Email to See Results !</h1>}
            >
              <TextField
                id="input-with-icon-textfield"
                className='w-full'
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
            </CustomWidthTooltip>
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
              <div style={{ maxHeight: 300, overflowY: "auto" }} className='pr-2 pl-2'>
                {
                  searchResult && searchResult?.map((user) => {
                    return <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  })
                }
              </div>
          }
          <div className='mx-1   bg-[#11256D] h-[0.1rem] rounded-full my-3'></div>

          <div className='p-1 flex justify-end'>
            <button type="submit" className="px-6 bg-[#11256D] text-center rounded-md text-white text-lg py-2 cursor-pointer"
              onClick={handleClose}>
              Close
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
