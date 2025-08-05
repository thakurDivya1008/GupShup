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
    <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-[20px]'>

      <div className='fixed top-[20px] left-[20px] cursor-pointer' onClick={()=>navigate("/")}>
        <IoMdArrowRoundBack className='w-[50px] h-[50px] text-grey-600' />
      </div>

        <div className=' bg-white rounded-full border-4 border-[#20c7ff] shadow-lg relative' onClick={() => image.current.click()}>
            <div className=' w-[200px] h-[200px] overflow-hidden rounded-full flex justify-center items-center'>
                <img src={frontendImage} alt="" className='h-[100%]'/>
            </div>
            <div className='absolute bottom-4 text-grey-700 right-4 w-[35px] h-[35px] bg-[#20c7ff] flex justify-center items-center shadow-grey-400 shadow-lg'>
              <IoCameraOutline className='text-grey-700 w-[25px] h-[25px]'/>
            </div>
           

        </div>

        <form action="" className='w-[95%] max-w-[500px] flex flex-col gap-[20px] items-center justify-center' onSubmit={handleProfile}>

          <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>

          <input type="text" placeholder='Enter your name' className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg  shadow-grey-400 shadow-lg text-grey-400 text-[19px]' onChange={(e)=>setName(e.target.value)} value={name}/>


          <input type="text" readOnly className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg  shadow-grey-400 shadow-lg text-grey-400 text-[19px]' value={userData?.userName}/>

          <input type="text" readOnly  className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg  shadow-grey-400 shadow-lg text-grey-400 text-[19px]' value={userData?.email}/>

          <button className='px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-grey-400 shadow-lg text-[20px] w-[200px] mt-[20px]font-semibold hover:shadow-inner' disabled={saving}>{saving?"saving..." : "Save Profile"}</button>
        </form>
    </div>
  )
}

export default Profile