import { Paper } from "@mui/material";
import SingleChat from "./SingleChat.jsx";

const Chatbox = ({fetchAgain, setFetchAgain}) => {
    return <Paper elevation={3} className='h-full'>
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Paper>
}

export default Chatbox;