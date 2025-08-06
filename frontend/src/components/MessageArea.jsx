import React, { useRef, useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.jpg"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { FaImages } from 'react-icons/fa6'
import { RiSendPlane2Fill } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';
import axios from "axios"
import { serverUrl } from '../main';
import { setMessages } from '../redux/messageSlice';



const MessageArea = () => {
    let {selectedUser, userData}= useSelector(state=>state.user);
    let dispatch = useDispatch();
    let [showPicker, setShowPicker] = useState(false);
    let [input, setInput] = useState("");
    let [frontendImage, setFrontendImage] = useState(null);
    let [backendImage, setBackendImage] = useState(null);

    let image = useRef()
    let {messages} = useSelector(state=>state.message);


     const handleImage=(e)=>{
      let file=e.target.files[0]
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }

    const handleSendMessage=async (e)=>{
      e.preventDefault()
      try {
        let formData= new FormData()
        formData.append("message",input)

        if(backendImage){
          formData.append("image", backendImage)
        }

        let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, {withCredentials:true})
        dispatch(setMessages([...messages,result.data]))
        setInput("")
        setFrontendImage(null)
        setBackendImage(null)
        
      } catch (error) {
        console.log(error)
      }
    }

    const onEmojiClick =(emojiData)=>{
        setInput(prevInput=>prevInput+emojiData.emoji);
        setShowPicker(false)
    }
   
  return (
    <div className={`lg:w-[70%] relative ${selectedUser? "flex": "hidden"} lg:flex w-full h-full bg-slate-200 border-l-2 border-grey-300`}>

{selectedUser && 
<div className='w-full h-[100vh] flex flex-col'>
<div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-grey-400 shadow-lg flex items-center px-[20px] gap-[20px]'>
                     <div className='cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))} >
                            <IoMdArrowRoundBack className='w-[40px] h-[40px] text-white' />
                          </div>

                           <div className='w-[50px] h-[50px] overflow-hidden rounded-full flex justify-center items-center shadow-grey-500 shadow-lg bg-white'>
                                          <img src={selectedUser.image || dp} alt="" className='h-[100%]'/> 
                                          </div>

                                          <h1 className='text-white font-semibold text-[20px]'>{selectedUser.name || "user"}</h1>
                   
                </div> 
                <div className='w-full h-[550px] flex flex-col py-[30px] px-[20px] overflow-auto gap-[20px]'>

                  {showPicker && 
                  <div className='absolute bottom-[120px] left-[20px]'>
                    <EmojiPicker width={250} height={350} className='shadow-lg' onEmojiClick={onEmojiClick}/>
                    {/* <SenderMessage/>
                    <RecieverMessage/> */}
                  </div>
                  }

                  {messages && messages.map((mess)=>(
                    mess.sender==userData._id?<SenderMessage image={mess.image} message={mess.message}/>:<RecieverMessage image={mess.image} message={mess.message}/>
                  ))}

                </div>
                
</div>

               }
        
        {!selectedUser && 
        <div className='w-full h-full flex flex-col justify-center items-center'>
          <h1 className="text-grey-700 font-bold text-[50px]">Welcome to GupShup</h1>
          <span className='text-grey-700 font-bold text-[30px]'>Chat Friendly !</span>
          </div>}

          {selectedUser &&  <div className='w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center'>
            <img src={frontendImage} alt="" className='w-[80px] absolute bottom-[100px] right-[20%] rounded-lg shadow-grey-400 shadow-lg'/>

            <form className='w-[95%] lg:w-[70%] h-[60px] bg-[#1797c2] shadow-grey-400 shadow-lg rounded-full flex items-center gap-[20px] px-[20px]' onSubmit={handleSendMessage}>

              
              <div onClick={()=> setShowPicker(prev=>!prev)}>
                <RiEmojiStickerLine className='w-[25px] h-[25px] text-white cursor-pointer'/>
              </div>
              <input type="file" accept='image/*'ref={image} hidden onChange={handleImage} />
              <input type="text"  className='w-full h-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-white' placeholder='Type a message...' onChange={(e)=>setInput(e.target.value)} value={input}/>
               <div onClick={()=>image.current.click()}>
                <FaImages className='w-[25px] h-[25px] text-white cursor-pointer'/>
               </div>
               <button>
                <RiSendPlane2Fill className='w-[25px] h-[25px] text-white cursor-pointer'/>
               </button>
            </form>

            </div>  }


              
    </div>
  )
}

export default MessageArea

