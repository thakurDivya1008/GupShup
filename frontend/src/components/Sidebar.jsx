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
import ThemeToggle from './ThemeToggle';

const SideBar = () => {
    let { userData, selectedUser } = useSelector(state=>state.user);
    let { conversations, loading } = useSelector(state => state.conversations);
    let [search, setSearch ] = useState(false);
    let [searchQuery, setSearchQuery] = useState('');
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

    // Filter conversations based on search query
    const filteredConversations = conversations.filter(conv => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      
      if (conv.isGroup) {
        // Search in group name
        return conv.groupName?.toLowerCase().includes(query);
      } else {
        // Search in other user's name
        const otherUser = getOtherUser(conv, userData);
        return (
          otherUser.name?.toLowerCase().includes(query) ||
          otherUser.userName?.toLowerCase().includes(query)
        );
      }
    });

    // Filter all users based on search query
    const filteredUsers = allUsers.filter(user => {
      if (!searchQuery.trim()) return false; // Only show users when searching
      
      const query = searchQuery.toLowerCase();
      return (
        user.name?.toLowerCase().includes(query) ||
        user.userName?.toLowerCase().includes(query)
      );
    });

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

    // Handle user selection from search results
    const handleUserSelect = async (selectedUser) => {
      try {
        // Check if conversation already exists
        const existingConv = conversations.find(conv => 
          !conv.isGroup && 
          conv.participants.some(p => p._id === selectedUser._id)
        );

        if (existingConv) {
          dispatch(setSelectedUser(selectedUser));
        } else {
          // Create new conversation
          const response = await axios.post(
            `${serverUrl}/api/conversation/create`,
            { participantId: selectedUser._id },
            { withCredentials: true }
          );
          
          if (response.data) {
            dispatch(addConversation(response.data));
            dispatch(setSelectedUser(selectedUser));
          }
        }
        
        setSearchQuery('');
        setSearch(false);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    };

  return (
    <div className={`lg:w-[30%] w-full h-full lg:block bg-slate-200 dark:bg-slate-800 ${!selectedUser? "block":"hidden"} animate-slideIn`}>

        <div className='w-[60px] h-[60px] mt-[10px] overflow-hidden rounded-full flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 shadow-lg dark:shadow-xl fixed bottom-[20px] left-[10px] cursor-pointer z-50 hover-lift' onClick={handleLogout}>
                <RiLogoutCircleLine className='w-[25px] h-[25px] text-white' />
                </div> 

        <div className='w-full h-[300px] bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 rounded-b-[30%] shadow-lg dark:shadow-xl flex flex-col justify-center px-[20px] relative'>
            <div className='absolute top-4 right-4'>
                <ThemeToggle />
            </div>
            <h1 className='text-white font-bold text-[25px] animate-fadeIn'>GupShup</h1>
            <div className='w-full flex justify-between items-center'>
                <h1 className='text-white font-bold text-[25px]'>Hi, {userData.name || "User"}</h1>
                <div className='w-[60px] h-[60px] bg-white dark:bg-slate-700 overflow-hidden rounded-full flex justify-center items-center shadow-lg dark:shadow-xl cursor-pointer hover-lift' onClick={()=>navigate("/profile")}>
                <img src={userData.image || dp} alt="" className='h-[100%]'/>
            </div>
            </div>
            
            <div className='w-full flex items-center gap-[20px]'>
                <button
                  className='flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 text-white px-4 py-2 rounded-full mb-2 mt-2 shadow-lg dark:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800'
                  onClick={() => setShowGroupModal(true)}
                  title='Create Group Chat'
                >
                  <HiUserGroup className='w-6 h-6' />
                  <span className='font-semibold'>New Group</span>
                </button>
                {!search && 
                 <div className='w-[60px] h-[60px] mt-[10px] overflow-hidden rounded-full flex justify-center items-center bg-white dark:bg-slate-700 shadow-lg dark:shadow-xl cursor-pointer hover-lift' onClick={() => setSearch(true)}>
                <MdOutlinePersonSearch className='w-[25px] h-[25px] text-gray-700 dark:text-gray-300' />
                </div> 
                }

                {search && 
                <form className='w-full h-[60px] bg-white dark:bg-slate-700 shadow-lg dark:shadow-xl flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px]'>
                    <MdOutlinePersonSearch className='w-[25px] h-[25px] text-gray-700 dark:text-gray-300' />
                    <input 
                      type="text" 
                      placeholder='Search users or groups...' 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-full h-full p-[10px] text-[17px] outline-0 border-0 bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400' 
                    />
                    <RxCross2 className='w-[25px] h-[25px] cursor-pointer text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200' onClick={()=>{
                      setSearch(false);
                      setSearchQuery('');
                    }}/>
                    </form>}
                
                {/* {!search && otherUsers?.map((user)=>(
                       <div className='w-[60px] h-[60px] mt-[10px] overflow-hidden rounded-full flex justify-center items-center shadow-grey-500 shadow-lg bg-white'>
                <img src={user.image || dp} alt="" className='h-[100%]'/> 
                </div>
                    ))} */}
                    
              
            </div>
        </div>

        <div className='w-full h-[60vh] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]'>
          {/* Search Results */}
          {search && searchQuery.trim() && (
            <div className='w-full px-4'>
              <h3 className='text-gray-700 dark:text-gray-300 font-semibold mb-2'>Search Results</h3>
              
              {/* Show filtered users */}
              {filteredUsers.length > 0 && (
                <div className='mb-4'>
                  <h4 className='text-gray-600 dark:text-gray-400 text-sm mb-2'>Users</h4>
                  {filteredUsers.map(user => (
                    <div
                      key={user._id}
                      className='w-full h-[50px] flex justify-start items-center gap-[15px] bg-white dark:bg-slate-700 shadow-md dark:shadow-lg rounded-full hover:bg-cyan-50 dark:hover:bg-slate-600 cursor-pointer relative hover-lift transition-all duration-300 mb-2 px-4'
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className='w-[40px] h-[40px] overflow-hidden rounded-full flex justify-center items-center shadow-md bg-white dark:bg-slate-600'>
                        <img src={user.image || dp} alt='' className='h-[100%]' />
                      </div>
                      <h1 className='text-gray-800 dark:text-gray-200 font-medium text-[16px]'>
                        {user.name || user.userName}
                      </h1>
                    </div>
                  ))}
                </div>
              )}

              {/* Show filtered conversations */}
              {filteredConversations.length > 0 && (
                <div>
                  <h4 className='text-gray-600 dark:text-gray-400 text-sm mb-2'>Conversations</h4>
                  {filteredConversations.map(conv => (
                    <div
                      key={conv._id}
                      className='w-full h-[50px] flex justify-start items-center gap-[15px] bg-white dark:bg-slate-700 shadow-md dark:shadow-lg rounded-full hover:bg-cyan-50 dark:hover:bg-slate-600 cursor-pointer relative hover-lift transition-all duration-300 mb-2 px-4'
                      onClick={async () => {
                        dispatch(setSelectedUser(conv.isGroup ? conv : getOtherUser(conv, userData)));
                        try {
                          await axios.post(`${serverUrl}/api/conversation/${conv._id}/read`, {}, { withCredentials: true });
                          dispatch(resetUnread(conv._id));
                        } catch (err) {
                          console.error('Failed to reset unread:', err);
                        }
                        setSearchQuery('');
                        setSearch(false);
                      }}
                    >
                      <div className='w-[40px] h-[40px] overflow-hidden rounded-full flex justify-center items-center shadow-md bg-white dark:bg-slate-600'>
                        {conv.isGroup ? (
                          <img src={conv.groupImage || dp} alt='' className='h-[100%]' />
                        ) : (
                          <img src={(getOtherUser(conv, userData).image) || dp} alt='' className='h-[100%]' />
                        )}
                      </div>
                      <h1 className='text-gray-800 dark:text-gray-200 font-medium text-[16px]'>
                        {conv.isGroup ? conv.groupName : (getOtherUser(conv, userData).name || getOtherUser(conv, userData).userName)}
                      </h1>
                      {conv.unread > 0 && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 dark:bg-green-400 text-white dark:text-gray-900 rounded-full px-2 py-0.5 text-xs font-bold shadow animate-pulse">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* No results message */}
              {filteredUsers.length === 0 && filteredConversations.length === 0 && searchQuery.trim() && (
                <div className='text-center text-gray-400 dark:text-gray-500 py-4'>
                  No users or conversations found.
                </div>
              )}
            </div>
          )}

          {/* Regular conversations list (when not searching) */}
          {(!search || !searchQuery.trim()) && (
            <>
              {console.log('Full conversations array:', conversations)}
              {console.log('Conversations with unread details:', conversations.map(c => ({ 
                id: c._id, 
                unread: c.unread, 
                name: c.isGroup ? c.groupName : 'direct',
                participants: c.participants 
              })))}
              {conversations.length === 0 && <div className='text-center text-gray-400 dark:text-gray-500 animate-fadeIn'>No conversations found.</div>}
              {conversations.map(conv => (
                <div
                  key={conv._id}
                  className='w-[95%] h-[60px] flex justify-start items-center gap-[20px] bg-white dark:bg-slate-700 shadow-lg dark:shadow-xl rounded-full hover:bg-cyan-50 dark:hover:bg-slate-600 cursor-pointer relative hover-lift transition-all duration-300'
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
                  <div className='w-[60px] h-[60px] overflow-hidden rounded-full flex justify-center items-center shadow-lg dark:shadow-xl bg-white dark:bg-slate-600'>
                    {conv.isGroup ? (
                      <img src={conv.groupImage || dp} alt='' className='h-[100%]' />
                    ) : (
                      <img src={(getOtherUser(conv, userData).image) || dp} alt='' className='h-[100%]' />
                    )}
                  </div>
                  <h1 className='text-gray-800 dark:text-gray-200 font-semibold text-[20px]'>
                    {conv.isGroup ? conv.groupName : (getOtherUser(conv, userData).name || getOtherUser(conv, userData).userName)}
                  </h1>
                  {conv.unread > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 dark:bg-green-400 text-white dark:text-gray-900 rounded-full px-2 py-0.5 text-xs font-bold shadow animate-pulse">
                      {conv.unread}
                    </span>
                  )}
                </div>
              ))}
            </>
          )}
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