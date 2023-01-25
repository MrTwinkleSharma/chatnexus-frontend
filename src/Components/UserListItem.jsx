import { Paper } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
    return <Paper elevation={2} onClick={handleFunction}>
        <div className="flex space-x-3 items-center my-2 hover:bg-[#D3D3D3] cursor-pointer p-2">
            <div className="">
                <img className="w-16 h-16 rounded-full" src={user.profilePicture} alt="profilePicture" />
            </div>
            <div>
                <div>
                    {user.name}
                </div>
                <div>
                    <b>Email: </b>{user.email}
                </div>
            </div>
        </div>
    </Paper>
}

export default UserListItem;