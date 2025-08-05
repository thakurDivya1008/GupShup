import React from 'react'
// import { IoMdArrowRoundBack } from "react-icons/io";
// import dp from "../assets/dp.jpg"
// import { useDispatch, useSelector } from 'react-redux';
// import { setSelectedUser } from '../redux/userSlice';

// const MessageArea = () => {
//     let {selectedUser}= useSelector(state=>state.user);
//     let dispatch = useDispatch();
//   return (
//     <div className={`lg:w-[70%] relative ${selectedUser? "flex": "hidden"} lg:flex w-full h-full bg-slate-200 border-l-2 border-grey-300`}>

// {selectedUser && <div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-grey-400 shadow-lg flex items-center px-[20px] gap-[20px]'>
//                      <div className='cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))} >
//                             <IoMdArrowRoundBack className='w-[40px] h-[40px] text-white' />
//                           </div>

//                            <div className='w-[50px] h-[50px] overflow-hidden rounded-full flex justify-center items-center shadow-grey-500 shadow-lg bg-white'>
//                                           <img src={selectedUser.image || dp} alt="" className='h-[100%]'/> 
//                                           </div>

//                                           <h1 className='text-white font-semibold text-[20px]'>{selectedUser.name || "user"}</h1>
                   
//                 </div> }
        
//         {!selectedUser && 
//         <div className='w-full h-full flex flex-col justify-center items-center'>
//           <h1 className="text-grey-700 font-bold text-[50px]">Welcome to GupShup</h1>
//           <span className='text-grey-700 font-bold text-[30px]'>Chat Friendly !</span>
//           </div>}


//           <div className='w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center marker:'>
//             <form className='w-[95%] max-w-[60%] h-[60px] bg-[#1797c2] shadow-grey-400 shadow-lg rounded-full'>

//             </form>

//             </div>      
//     </div>
//   )
// }

// export default MessageArea




// import { useState } from 'react';
// import { IoMdArrowRoundBack } from 'react-icons/io';
// import { BsEmojiSmile, BsFillSendFill, BsPaperclip } from 'react-icons/bs';
// import Picker from '@emoji-mart/react';
// import data from '@emoji-mart/data';

// import dp from '../assets/dp.jpg';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSelectedUser } from '../redux/userSlice';

// const MessageArea = () => {
//   const { selectedUser } = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   const [message, setMessage] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [image, setImage] = useState(null);

//   const handleEmojiSelect = (emoji) => {
//     setMessage((prev) => prev + emoji.native);
//   };

//   const handleSend = (e) => {
//     e.preventDefault();
//     if (!message && !image) return;

//     // Handle sending message logic here (emit via socket, etc.)
//     console.log('Message:', message);
//     console.log('Image:', image);

//     setMessage('');
//     setImage(null);
//     setShowEmojiPicker(false);
//   };

//   return (
//     <div
//       className={`lg:w-[70%] relative ${
//         selectedUser ? 'flex' : 'hidden'
//       } lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-300 flex-col`}
//     >
//       {/* Header */}
//       {selectedUser && (
//         <div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-lg flex items-center px-5 gap-5'>
//           <div
//             className='cursor-pointer'
//             onClick={() => dispatch(setSelectedUser(null))}
//           >
//             <IoMdArrowRoundBack className='w-[40px] h-[40px] text-white' />
//           </div>

//           <div className='w-[50px] h-[50px] overflow-hidden rounded-full shadow-lg bg-white flex justify-center items-center'>
//             <img
//               src={selectedUser.image || dp}
//               alt='User'
//               className='h-full object-cover'
//             />
//           </div>

//           <h1 className='text-white font-semibold text-xl'>
//             {selectedUser.name || 'User'}
//           </h1>
//         </div>
//       )}

//       {/* Empty message when no user selected */}
//       {!selectedUser && (
//         <div className='w-full h-full flex flex-col justify-center items-center'>
//           <h1 className='text-gray-700 font-bold text-4xl'>
//             Welcome to GupShup
//           </h1>
//           <span className='text-gray-700 font-medium text-2xl'>
//             Chat Friendly!
//           </span>
//         </div>
//       )}

//       {/* Message input area */}
//       {selectedUser && (
//         <div className='w-full px-4 py-3 mt-auto relative z-50'>
//           {/* Emoji Picker */}
//           {showEmojiPicker && (
//             <div className='absolute bottom-[80px] left-4 z-50'>
//               <Picker data={data} onEmojiSelect={handleEmojiSelect} />
//             </div>
//           )}

//           <form
//             onSubmit={handleSend}
//             className='w-full h-[60px] bg-white rounded-full flex items-center px-4 shadow-md'
//           >
//             {/* Emoji button */}
//             <BsEmojiSmile
//               className='text-2xl text-gray-600 cursor-pointer hover:text-[#1797c2] transition'
//               onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//             />

//             {/* File input */}
//             <label className='ml-4 cursor-pointer text-gray-600 hover:text-[#1797c2] transition'>
//               <BsPaperclip className='text-2xl' />
//               <input
//                 type='file'
//                 accept='image/*'
//                 onChange={(e) => setImage(e.target.files[0])}
//                 className='hidden'
//               />
//             </label>

//             {/* Input field */}
//             <input
//               type='text'
//               placeholder='Type a message...'
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className='flex-1 mx-4 outline-none bg-transparent text-gray-800 placeholder-gray-500'
//             />

//             {/* Send button */}
//             <button
//               type='submit'
//               className='bg-[#1797c2] text-white p-2 rounded-full hover:scale-110 transform transition duration-300'
//             >
//               <BsFillSendFill className='text-lg' />
//             </button>
//           </form>

//           {/* Image preview */}
//           {image && (
//             <div className='mt-3 ml-4'>
//               <span className='text-sm text-gray-500'>Selected Image:</span>
//               <img
//                 src={URL.createObjectURL(image)}
//                 alt='preview'
//                 className='w-24 h-24 object-cover rounded mt-1 shadow'
//               />
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessageArea;


// import { useState } from 'react';
// import { IoMdArrowRoundBack } from 'react-icons/io';
// import { BsEmojiSmile, BsFillSendFill, BsPaperclip } from 'react-icons/bs';
// import EmojiPicker from 'emoji-picker-react';
// import socket from "../socket";

// import dp from '../assets/dp.jpg';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSelectedUser } from '../redux/userSlice';

// const MessageArea = () => {
//   const { selectedUser } = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   const [message, setMessage] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [image, setImage] = useState(null);

//   // const handleSend = (e) => {
//   //   e.preventDefault();
//   //   if (!message && !image) return;

//   //   // Send logic here (e.g. emit via socket)
//   //   console.log('Message:', message);
//   //   console.log('Image:', image);

//   //   setMessage('');
//   //   setImage(null);
//   //   setShowEmojiPicker(false);
//   // };

//   const handleSend = (e) => {
//   e.preventDefault();
//   if (!message && !image) return;

//   socket.emit("send-message", {
//     senderId: currentUserId,      // from Redux or session
//     receiverId: selectedUser._id, // user you're chatting with
//     message,
//     image,
//   });

//   setMessage('');
//   setImage(null);
//   setShowEmojiPicker(false);
// };

//   const handleEmojiClick = (emojiData) => {
//     setMessage((prev) => prev + emojiData.emoji);
//   };

//   return (
//     <div
//       className={`lg:w-[70%] relative ${
//         selectedUser ? 'flex' : 'hidden'
//       } lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-300 flex-col`}
//     >
//       {/* Header */}
//       {selectedUser && (
//         <div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-lg flex items-center px-5 gap-5'>
//           <div
//             className='cursor-pointer'
//             onClick={() => dispatch(setSelectedUser(null))}
//           >
//             <IoMdArrowRoundBack className='w-[40px] h-[40px] text-white' />
//           </div>

//           <div className='w-[50px] h-[50px] overflow-hidden rounded-full shadow-lg bg-white flex justify-center items-center'>
//             <img
//               src={selectedUser.image || dp}
//               alt='User'
//               className='h-full object-cover'
//             />
//           </div>

//           <h1 className='text-white font-semibold text-xl'>
//             {selectedUser.name || 'User'}
//           </h1>
//         </div>
//       )}

//       {/* Empty message fallback */}
//       {!selectedUser && (
//         <div className='w-full h-full flex flex-col justify-center items-center'>
//           <h1 className='text-gray-700 font-bold text-4xl'>
//             Welcome to GupShup
//           </h1>
//           <span className='text-gray-700 font-medium text-2xl'>
//             Chat Friendly!
//           </span>
//         </div>
//       )}

//       {/* Chat Input Area */}
//       {selectedUser && (
//         <div className='w-full px-4 py-3 mt-auto relative z-50'>
//           {showEmojiPicker && (
//             <div className='absolute bottom-[80px] left-4 z-50'>
//               <EmojiPicker onEmojiClick={handleEmojiClick} />
//             </div>
//           )}

//           <form
//             onSubmit={handleSend}
//             className='w-full h-[60px] bg-white rounded-full flex items-center px-4 shadow-md'
//           >
//             {/* Emoji Button */}
//             <BsEmojiSmile
//               className='text-2xl text-gray-600 cursor-pointer hover:text-[#1797c2] transition'
//               onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//             />

//             {/* File Upload */}
//             <label className='ml-4 cursor-pointer text-gray-600 hover:text-[#1797c2] transition'>
//               <BsPaperclip className='text-2xl' />
//               <input
//                 type='file'
//                 accept='image/*'
//                 onChange={(e) => setImage(e.target.files[0])}
//                 className='hidden'
//               />
//             </label>

//             {/* Text Input */}
//             <input
//               type='text'
//               placeholder='Type a message...'
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className='flex-1 mx-4 outline-none bg-transparent text-gray-800 placeholder-gray-500'
//             />

//             {/* Send Button */}
//             <button
//               type='submit'
//               className='bg-[#1797c2] text-white p-2 rounded-full hover:scale-110 transform transition duration-300'
//             >
//               <BsFillSendFill className='text-lg' />
//             </button>
//           </form>

//           {/* Optional image preview */}
//           {image && (
//             <div className='mt-3 ml-4'>
//               <span className='text-sm text-gray-500'>Selected Image:</span>
//               <img
//                 src={URL.createObjectURL(image)}
//                 alt='preview'
//                 className='w-24 h-24 object-cover rounded mt-1 shadow'
//               />
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessageArea;



import { useEffect, useRef, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BsEmojiSmile, BsFillSendFill, BsPaperclip } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import socket from "../socket";

import dp from '../assets/dp.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../main';

const MessageArea = () => {
  const { selectedUser, userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser && userData?._id) {
      axios.get(`${serverUrl}/api/message/${userData._id}/${selectedUser._id}`)
        .then(res => setMessages(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedUser, userData]);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      if (data.sender === selectedUser._id || data.receiver === selectedUser._id) {
        setMessages(prev => [...prev, data]);
      }
    });
    return () => socket.off("receive-message");
  }, [selectedUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message && !image) return;

    socket.emit("send-message", {
      senderId: userData._id,
      receiverId: selectedUser._id,
      message,
      image,
    });

    setMessage('');
    setImage(null);
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className={`lg:w-[70%] relative ${selectedUser ? 'flex' : 'hidden'} lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-300 flex-col`}>
      {selectedUser && (
        <div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-lg flex items-center px-5 gap-5'>
          <div
            className='cursor-pointer'
            onClick={() => dispatch(setSelectedUser(null))}
          >
            <IoMdArrowRoundBack className='w-[40px] h-[40px] text-white' />
          </div>

          <div className='w-[50px] h-[50px] overflow-hidden rounded-full shadow-lg bg-white flex justify-center items-center'>
            <img
              src={selectedUser.image || dp}
              alt='User'
              className='h-full object-cover'
            />
          </div>

          <h1 className='text-white font-semibold text-xl'>
            {selectedUser.name || 'User'}
          </h1>
        </div>
      )}

      {/* Message List */}
      <div className='flex-1 overflow-y-auto px-4 py-2'>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 max-w-[70%] px-4 py-2 rounded-lg ${msg.sender === userData._id ? 'bg-[#1797c2] text-white self-end ml-auto' : 'bg-white text-gray-800'}`}>
            {msg.message && <p>{msg.message}</p>}
            {msg.image && <img src={msg.image} alt="sent" className='w-full rounded mt-1' />}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      {selectedUser && (
        <div className='w-full px-4 py-3 mt-auto relative z-50'>
          {showEmojiPicker && (
            <div className='absolute bottom-[80px] left-4 z-50'>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <form
            onSubmit={handleSend}
            className='w-full h-[60px] bg-white rounded-full flex items-center px-4 shadow-md'
          >
            <BsEmojiSmile
              className='text-2xl text-gray-600 cursor-pointer hover:text-[#1797c2] transition'
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />

            <label className='ml-4 cursor-pointer text-gray-600 hover:text-[#1797c2] transition'>
              <BsPaperclip className='text-2xl' />
              <input
                type='file'
                accept='image/*'
                onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                className='hidden'
              />
            </label>

            <input
              type='text'
              placeholder='Type a message...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='flex-1 mx-4 outline-none bg-transparent text-gray-800 placeholder-gray-500'
            />

            <button
              type='submit'
              className='bg-[#1797c2] text-white p-2 rounded-full hover:scale-110 transform transition duration-300'
            >
              <BsFillSendFill className='text-lg' />
            </button>
          </form>

          {image && (
            <div className='mt-3 ml-4'>
              <span className='text-sm text-gray-500'>Selected Image:</span>
              <img
                src={image}
                alt='preview'
                className='w-24 h-24 object-cover rounded mt-1 shadow'
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageArea;
