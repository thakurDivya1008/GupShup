import React, { useState } from 'react'
import { HiUserGroup } from 'react-icons/hi';
import GroupModal from './GroupModal';
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.jpg"
import { MdOutlinePersonSearch } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { RiLogoutCircleLine } from "react-icons/ri";
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherUsers, setSelectedUser, setUserData } from '../redux/userSlice';
import { useState as useLocalState, useEffect as useLocalEffect } from 'react';
import { fetchConversations, addConversation, resetUnread } from '../redux/conversationSlice';

const SideBar = () => {
    let { userData, selectedUser } = useSelector(state=>state.user);
    let { conversations, loading } = useSelector(state => state.conversations);
    let [search, setSearch ] = useState(false);
    let [showGroupModal, setShowGroupModal] = useState(false);
    let [allUsers, setAllUsers] = useLocalState([]);
    let dispatch = useDispatch();
    let navigate = useNavigate();

    // Helper to get the other user in a direct chat
    function getOtherUser(conv, userData) {
      if (!conv.participants) return {};
      // participants may be array of user objects or ids
      if (typeof conv.participants[0] === 'object') {
        return conv.participants.find(u => u._id !== userData._id) || {};
      } else {
        // fallback: if only ids, just return empty
        return {};
      }
    }

    // Fetch all users for sidebar (person chat)
    useLocalEffect(() => {
      axios.get(`${serverUrl}/api/user/all`, { withCredentials: true })
        .then(res => setAllUsers(res.data));
    }, []);

    // Fetch conversations on mount
    React.useEffect(() => {
      dispatch(fetchConversations());
    }, [dispatch]);
     
    const handleLogout=async ()=>{

        try {
             let result = await axios.get(`${serverUrl}/api/auth/logout`, {withCredentials:true});

        dispatch(setUserData(null))
        dispatch(setOtherUsers(null))
        navigate("/login")
        } catch (error) {
            console.log(error);
            
        }
       
    }


  return (
    <div className={`lg:w-[30%] w-full h-full lg:block bg-slate-200 ${!selectedUser? "block":"hidden"}`}>

        <div className=' w-[60px] h-[60px] mt-[10px] overflow-hidden rounded-full flex justify-center items-center bg-[#20c7ff]  shadow-grey-500 shadow-lg fixed bottom-[20px] left-[10px] cursor-pointer z-50' onClick={handleLogout}>
                <RiLogoutCircleLine className='w-[25px] h-[25px]' />
                </div> 

        <div className='w-full h-[300px] bg-[#20c7ff] rounded-b-[30%] shadow-grey-400 shadow-lg flex flex-col justify-center px-[20px]'>
            <h1 className='text-white font-bold text-[25px]'>GupShup</h1>
            <div className='w-full flex justify-between items-center'>
                <h1 className='text-grey-800 font-bold text-[25px]'>Hii, {userData.name || "User"}</h1>
                <div className=' w-[60px] h-[60px] bg-white overflow-hidden rounded-full flex justify-center items-center shadow-grey-500 shadow-lg cursor-pointer' onClick={()=>navigate("/profile")}>
                <img src={userData.image || dp} alt="" className='h-[100%]'/>
            </div>
            </div>
            
            <div className='w-full flex items-center gap-[20px]'>
                <button
                  className='flex items-center gap-2 bg-gradient-to-r from-[#1797c2] to-[#20c7ff] text-white px-4 py-2 rounded-full mb-2 mt-2 shadow-md hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-[#1797c2] focus:ring-offset-2'
                  onClick={() => setShowGroupModal(true)}
                  title='Create Group Chat'
                >
                  <HiUserGroup className='w-6 h-6' />
                  <span className='font-semibold'>New Group</span>
                </button>
                {!search && 
                 <div className=' w-[60px] h-[60px] mt-[10px] overflow-hidden rounded-full flex justify-center items-center bg-white shadow-grey-500 shadow-lg cursor-pointer' onClick={() => setSearch(true)}>
                <MdOutlinePersonSearch className='w-[25px] h-[25px]' />
                </div> 
                }

                {search && 
                <form className='w-full h-[60px]  bg-white shadow-grey-500 shadow-lg flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px]'>
                    <MdOutlinePersonSearch className='w-[25px] h-[25px]' />
                    <input type="text" placeholder='search users...' className='w-full h-full p-[10px] text-[17px] outline-0 border-0' />
                    <RxCross2 className='w-[25px] h-[25px] cursor-pointer' onClick={()=>setSearch(false)}/>
                    </form>}
                
                {/* {!search && otherUsers?.map((user)=>(
                       <div className='w-[60px] h-[60px] mt-[10px] overflow-hidden rounded-full flex justify-center items-center shadow-grey-500 shadow-lg bg-white'>
                <img src={user.image || dp} alt="" className='h-[100%]'/> 
                </div>
                    ))} */}
                    
              
            </div>
        </div>

        <div className='w-full h-[60vh] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]'>
          {console.log('Full conversations array:', conversations)}
          {console.log('Conversations with unread details:', conversations.map(c => ({ 
            id: c._id, 
            unread: c.unread, 
            name: c.isGroup ? c.groupName : 'direct',
            participants: c.participants 
          })))}
          {conversations.length === 0 && <div className='text-center text-gray-400'>No conversations found.</div>}
          {conversations.map(conv => (
            <div
              key={conv._id}
              className='w-[95%] h-[60px] flex justify-start items-center gap-[20px] bg-white shadow-grey-500 shadow-lg rounded-full hover:bg-[#b2ccdf] cursor-pointer relative'
              onClick={async () => {
                dispatch(setSelectedUser(conv.isGroup ? conv : getOtherUser(conv, userData)));
                try {
                  await axios.post(`${serverUrl}/api/conversation/${conv._id}/read`, {}, { withCredentials: true });
                  dispatch(resetUnread(conv._id));
                } catch (err) {
                  console.error('Failed to reset unread:', err);
                }
              }}
            >
              <div className='w-[60px] h-[60px] overflow-hidden rounded-full flex justify-center items-center shadow-grey-500 shadow-lg bg-white'>
                {conv.isGroup ? (
                  <img src={conv.groupImage || dp} alt='' className='h-[100%]' />
                ) : (
                  <img src={(getOtherUser(conv, userData).image) || dp} alt='' className='h-[100%]' />
                )}
              </div>
              <h1 className='text-grey-800 font-semibold text-[20px]'>
                {conv.isGroup ? conv.groupName : (getOtherUser(conv, userData).name || getOtherUser(conv, userData).userName)}
              </h1>
              {conv.unread > 0 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-bold shadow">
                  {conv.unread}
                </span>
              )}
            </div>
          ))}
        </div>
    <GroupModal
      open={showGroupModal}
      onClose={() => setShowGroupModal(false)}
      onGroupCreated={(group) => {
        dispatch(addConversation(group));
        setShowGroupModal(false);
      }}
      currentUser={userData}
    />
    </div>
  )
}

export default SideBar