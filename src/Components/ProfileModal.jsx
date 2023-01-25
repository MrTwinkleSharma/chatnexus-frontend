import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

export default function BasicModal({ user, profileOpen, handleProfileClose, handleClose }) {
    const handleBothClose = () => {
        handleProfileClose();
        handleClose();
    }
    // console.log(profileOpen);
    return (
        <div>
            <Modal
                open={profileOpen}
                onClose={handleBothClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <img className='my-4 w-24 h-24' src={user?.profilePicture} alt="" />
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h2">
                        Name: <b>{user?.name}</b>
                    </Typography>
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h2">
                        Email: <b>{user?.email}</b>
                    </Typography>
                    <div className='mt-4 bg-[#11256D] h-[0.1rem] rounded-full my-3'></div>

                    <div className='flex justify-end'>
                        <button type="submit" className="px-6 bg-[#11256D] text-center rounded-md text-white text-lg py-2 cursor-pointer"
                            onClick={handleBothClose}>
                            Close
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
