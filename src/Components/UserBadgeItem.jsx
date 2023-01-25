import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";

const UserBadgeItem = ({ user, handleFunction, admin, currentUser }) => {
  // console.log(user, admin);
  return (
    <div className="p-2 rounded-md inline bg-[#11256D] text-white">
      {user.name}
      {currentUser._id === user._id && <span> (You)</span>}
      {admin._id === user._id && <span> (Admin)</span>}
      <MdOutlinePersonRemoveAlt1 size={22}
        className='inline my-auto mx-2 cursor-pointer'
        onClick={handleFunction} />
    </div>
  );
};

export default UserBadgeItem;
