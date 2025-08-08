import { useRef, useState } from 'react'
import dp from "../assets/dp.jpg"
import { IoMdArrowRoundBack } from "react-icons/io";

import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';

const Profile = () => {
  let {userData}=useSelector(state=>state.user)
  let dispatch = useDispatch();
  let navigate= useNavigate();
  let [name, setName]=useState(userData.name || "");
  let [frontendImage, setFrontendImage]=useState(userData.image || dp);
  let [backendImage, setBackendImage] = useState(null);
  let image=useRef()
  let [saving, setSaving] = useState(false);

  const handleImage=(e)=>{
    let file=e.target.files[0]
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file))
  }

const handleProfile= async (e) => {
  
  e.preventDefault();
  setSaving(true);
  try {
    let formData = new FormData();
    formData.append("name",name);
    if(backendImage){
      formData.append("image", backendImage)
    }

    let result=await axios.put(`${serverUrl}/api/user/profile`, formData, {
      withCredentials:true,
      headers: {
    "Content-Type": "multipart/form-data",
  },

    })
    setSaving(false);

    dispatch(setUserData(result.data));
    navigate("/")
  } catch (error) {
    console.log(error);
    setSaving(false);
  }

}

  return (
    <div className='w-full h-[100vh] bg-slate-200 dark:bg-slate-900 flex flex-col justify-center items-center gap-[20px] animate-fadeIn'>

      <div className='fixed top-[20px] left-[20px] cursor-pointer hover:bg-white/10 p-2 rounded-full transition-all duration-200' onClick={()=>navigate("/")}>
        <IoMdArrowRoundBack className='w-[50px] h-[50px] text-gray-600 dark:text-gray-300' />
      </div>

        <div className='bg-white dark:bg-slate-700 rounded-full border-4 border-cyan-500 dark:border-cyan-400 shadow-lg dark:shadow-xl relative hover-lift' onClick={() => image.current.click()}>
            <div className='w-[200px] h-[200px] overflow-hidden rounded-full flex justify-center items-center'>
                <img src={frontendImage} alt="" className='h-[100%]'/>
            </div>
            <div className='absolute bottom-4 right-4 w-[35px] h-[35px] bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 flex justify-center items-center shadow-lg dark:shadow-xl rounded-full'>
              <IoCameraOutline className='text-white w-[25px] h-[25px]'/>
            </div>
           

        </div>

        <form action="" className='w-[95%] max-w-[500px] flex flex-col gap-[20px] items-center justify-center' onSubmit={handleProfile}>

          <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>

          <input type="text" placeholder='Enter your name' className='w-[90%] h-[50px] outline-none border-2 border-cyan-500 dark:border-cyan-400 px-[20px] py-[10px] bg-white dark:bg-slate-700 rounded-lg shadow-lg dark:shadow-xl text-gray-700 dark:text-gray-200 text-[19px] focus:border-cyan-600 dark:focus:border-cyan-300 transition-all duration-300' onChange={(e)=>setName(e.target.value)} value={name}/>


          <input type="text" readOnly className='w-[90%] h-[50px] outline-none border-2 border-cyan-500 dark:border-cyan-400 px-[20px] py-[10px] bg-white dark:bg-slate-700 rounded-lg shadow-lg dark:shadow-xl text-gray-700 dark:text-gray-200 text-[19px]' value={userData?.userName}/>

          <input type="text" readOnly  className='w-[90%] h-[50px] outline-none border-2 border-cyan-500 dark:border-cyan-400 px-[20px] py-[10px] bg-white dark:bg-slate-700 rounded-lg shadow-lg dark:shadow-xl text-gray-700 dark:text-gray-200 text-[19px]' value={userData?.email}/>

          <button className='w-[90%] h-[50px] bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 text-white font-semibold text-[19px] rounded-lg shadow-lg dark:shadow-xl hover:from-cyan-600 hover:to-blue-600 dark:hover:from-cyan-700 dark:hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed' disabled={saving}>{saving?"saving..." : "Save Profile"}</button>
        </form>
    </div>
  )
}

export default Profile