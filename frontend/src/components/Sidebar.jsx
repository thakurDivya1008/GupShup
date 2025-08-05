import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.jpg"
import { MdOutlinePersonSearch } from "react-icons/md";
import { Form, useNavigate } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { RiLogoutCircleLine } from "react-icons/ri";
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherUsers, setSelectedUser, setUserData } from '../redux/userSlice';

const SideBar = () => {
    let {userData, otherUsers, selectedUser} = useSelector(state=>state.user);
    let [search, setSearch ] = useState(false);
    let dispatch=useDispatch()
    let navigate = useNavigate()
     
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

        <div className=' w-[60px] h-[60px] mt-[10px] overflow-hidden rounded-full flex justify-center items-center bg-[#20c7ff]  shadow-grey-500 shadow-lg fixed bottom-[20px] left-[10px] cursor-pointer' onClick={handleLogout}>
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
                
                {!search && otherUsers?.map((user)=>(
                       <div className='w-[60px] h-[60px] mt-[10px] overflow-hidden rounded-full flex justify-center items-center shadow-grey-500 shadow-lg bg-white'>
                <img src={user.image || dp} alt="" className='h-[100%]'/> 
                </div>
                    ))}
                    
              
            </div>
        </div>

        <div className='w-full h-[60vh] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]'>
          
          
            {otherUsers?.map((user)=>(
                <div className='w-[95%] h-[60px] flex justify-start items-center gap-[20px] bg-white shadow-grey-500 shadow-lg rounded-full hover:bg-[#b2ccdf] cursor-pointer' onClick={()=>dispatch(setSelectedUser(user))}>
                       <div className='w-[60px] h-[60px] overflow-hidden rounded-full flex justify-center items-center shadow-grey-500 shadow-lg bg-white'>
                <img src={user.image || dp} alt="" className='h-[100%]'/> 
                </div>
                <h1 className='text-grey-800 font-semibold text-[20px]'>{user.name || user.userName}</h1>
                </div>
                    ))}
          
        </div>
    </div>
  )
}

export default SideBar