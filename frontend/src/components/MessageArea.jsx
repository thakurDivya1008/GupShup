import React, { useRef, useState, useEffect } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.jpg"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { FaImages } from 'react-icons/fa6';
import { FaFileAlt, FaPollH } from 'react-icons/fa';
import { RiSendPlane2Fill, RiAttachment2 } from 'react-icons/ri';
import { FiPhone, FiVideo, FiMoreVertical } from 'react-icons/fi';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { MdAudiotrack, MdVideoLibrary } from 'react-icons/md';
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';
import axios from "axios"
import { serverUrl } from '../main';
import { addMessage } from '../redux/messageSlice';
import { socket } from '../socket';
import { incrementUnread, resetUnread, fetchConversations } from '../redux/conversationSlice';


const MessageArea = () => {
    let {selectedUser, userData}= useSelector(state=>state.user);
    let dispatch = useDispatch();
    let [showPicker, setShowPicker] = useState(false);
    let [input, setInput] = useState("");
    let [frontendImage, setFrontendImage] = useState(null);
    let [backendImage, setBackendImage] = useState(null);
    let [showAttach, setShowAttach] = useState(false);
    let documentInput = useRef();
    let [frontendDoc, setFrontendDoc] = useState(null);
    let [backendDoc, setBackendDoc] = useState(null);

    let image = useRef()
    let {messages} = useSelector(state=>state.message);
    // Modal state for full-screen image
    const [modalImage, setModalImage] = useState(null);

    
    useEffect(() => {
      if (!messages || !userData?._id) return;
      const unseen = messages.filter(m => Array.isArray(m.seen) && !m.seen.includes(userData._id) && String(m.sender) !== String(userData._id));
      if (unseen.length > 0) {
        const messageIds = unseen.map(m => m._id);
        socket.emit('message:seen', { messageIds, userId: userData._id });
      }
    }, [messages, userData]);

    // Listen for message:seen:update to update message state
    useEffect(() => {
      const handleSeenUpdate = ({ messageId, seenBy }) => {
        dispatch(addMessage({ _id: messageId, seen: [seenBy] })); // This assumes addMessage merges seen array
      };
      socket.on('message:seen:update', handleSeenUpdate);
      return () => {
        socket.off('message:seen:update', handleSeenUpdate);
      };
    }, [dispatch]);


    const handleImage = (e) => {
      let file = e.target.files[0];
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    };

    const handleDocument = (e) => {
      let file = e.target.files[0];
      setBackendDoc(file);
      setFrontendDoc(file ? file.name : null);
    };

    const handleSendMessage = async (e) => {
      e.preventDefault();
      let imageUrl = null;
      let documentUrl = null;
      try {
        // If there is an image, upload it first
        if (backendImage) {
          const formData = new FormData();
          formData.append("image", backendImage);
          const res = await axios.post(`${serverUrl}/api/message/upload-image`, formData, { withCredentials: true });
          imageUrl = res.data.imageUrl;
        }
        // If there is a document, upload it
        if (backendDoc) {
          const formData = new FormData();
          formData.append("document", backendDoc);
          const res = await axios.post(`${serverUrl}/api/message/upload-document`, formData, { withCredentials: true });
          documentUrl = res.data.documentUrl;
        }
        // Now emit the socket event with the image/document URL (if any)
        socket.emit("send-message", {
          senderId: userData._id,
          receiverId: selectedUser.isGroup ? undefined : selectedUser._id,
          conversationId: selectedUser.isGroup ? selectedUser._id : undefined,
          isGroup: Boolean(selectedUser.isGroup),
          message: input,
          image: imageUrl,
          document: documentUrl
        });
        setInput("");
        setFrontendImage(null);
        setBackendImage(null);
        setFrontendDoc(null);
        setBackendDoc(null);
      } catch (error) {
        console.log(error);
      }
    };
    // Join room and listen for real-time messages
    useEffect(() => {
      if (userData?._id) {
        socket.emit("join", userData._id);
      }
      const handleReceiveMessage = (msg) => {
        console.log('Received message:', msg);
        const isGroup = Boolean(selectedUser?.isGroup);
        const sameGroup = isGroup && String(msg.conversationId) === String(selectedUser?._id);
        const sameDirect = !isGroup && (
          (String(msg.sender) === String(selectedUser?._id) && String(msg.receiver) === String(userData._id)) ||
          (String(msg.sender) === String(userData._id) && String(msg.receiver) === String(selectedUser?._id))
        );

        if ((isGroup && sameGroup) || (!isGroup && sameDirect)) {
          dispatch(addMessage(msg));
          if (msg.conversationId) {
            dispatch(resetUnread(msg.conversationId));
          }
        } else {
          dispatch(fetchConversations());
        }
      };
      socket.on("receive-message", handleReceiveMessage);
      return () => {
        socket.off("receive-message", handleReceiveMessage);
      };
    }, [selectedUser, userData, dispatch]);

    const onEmojiClick =(emojiData)=>{
        setInput(prevInput=>prevInput+emojiData.emoji);
        setShowPicker(false)
    }
   
  return (
    <div className={`lg:w-[70%] relative ${selectedUser? "flex": "hidden"} lg:flex w-full h-full bg-slate-200 dark:bg-slate-900 border-l-2 border-gray-300 dark:border-gray-600 animate-slideIn`}>

{selectedUser && 
<div className='w-full h-[100vh] flex flex-col'>
<div className='w-full h-[100px] bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 rounded-b-[30px] shadow-lg dark:shadow-xl flex items-center px-[20px] gap-[20px]'>
  <div className='cursor-pointer hover:bg-white/10 p-2 rounded-full transition-all duration-200' onClick={()=>dispatch(setSelectedUser(null))} >
    <IoMdArrowRoundBack className='w-[40px] h-[40px] text-white' />
  </div>
  <div className='w-[50px] h-[50px] overflow-hidden rounded-full flex justify-center items-center shadow-lg dark:shadow-xl bg-white dark:bg-slate-700'>
    <img src={(selectedUser.isGroup ? selectedUser.groupImage : selectedUser.image) || dp} alt="" className='h-[100%]' />
  </div>
  <div className='flex flex-col'>
    <h1 className='text-white font-semibold text-[18px]'>
      {selectedUser.isGroup ? selectedUser.groupName : (selectedUser.name || "user")}
    </h1>
    {selectedUser.isGroup && (
      <div className='text-cyan-100 text-xs max-w-[60vw] whitespace-nowrap overflow-hidden text-ellipsis'>
        {(Array.isArray(selectedUser.members) ? selectedUser.members : [])
          .map(m => (m?.name || m?.userName))
          .filter(Boolean)
          .join(", ")}
      </div>
    )}
  </div>
  <div className='ml-auto flex items-center gap-6'>
    <FiPhone className='w-6 h-6 text-white cursor-pointer hover:text-cyan-200 transition-colors duration-200' title="Audio Call" />
    <FiVideo className='w-6 h-6 text-white cursor-pointer hover:text-cyan-200 transition-colors duration-200' title="Video Call" />
    {selectedUser.isGroup && (
      <button
        onClick={async () => {
          try {
            await axios.post(`${serverUrl}/api/group/${selectedUser._id}/leave`, {}, { withCredentials: true });
            // After leaving, clear this chat from view
            dispatch(setSelectedUser(null));
            dispatch(fetchConversations());
          } catch (err) {
            console.error('Failed to leave group', err);
          }
        }}
        className='flex items-center gap-2 text-white/90 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all'
        title='Leave Group'
      >
        <RiLogoutCircleLine className='w-4 h-4' />
        Exit
      </button>
    )}
  </div>
</div>
                <div className='w-full h-[550px] flex flex-col py-[30px] px-[20px] overflow-auto gap-[20px]'>

                  {showPicker && 
                  <div className='absolute bottom-[120px] left-[20px]'>
                    <EmojiPicker width={250} height={350} className='shadow-lg' onEmojiClick={onEmojiClick}/>
                    {/* <SenderMessage/>
                    <RecieverMessage/> */}
                  </div>
                  }

                  {messages && messages.map((mess) => {
                    const isSelf = String(mess.sender) === String(userData._id);
                    let senderUser = null;
                    if (selectedUser?.isGroup) {
                      const pool = [
                        ...(Array.isArray(selectedUser.members) ? selectedUser.members : []),
                        ...(Array.isArray(selectedUser.participants) ? selectedUser.participants : []),
                      ];
                      senderUser = pool.find(u => String(u?._id || u) === String(mess.sender)) || null;
                    }
                    return isSelf ? (
                      <SenderMessage 
                        key={mess._id || mess.createdAt} 
                        image={mess.image} 
                        message={mess.message} 
                        seen={mess.seen} 
                        onImageClick={setModalImage} 
                        currentUserId={userData._id}
                        createdAt={mess.createdAt}
                      />
                    ) : (
                      <RecieverMessage 
                        key={mess._id || mess.createdAt} 
                        image={mess.image} 
                        message={mess.message} 
                        sender={senderUser} 
                        isGroup={Boolean(selectedUser?.isGroup)} 
                        onImageClick={setModalImage}
                        createdAt={mess.createdAt}
                      />
                    );
                  })}

                </div>
                
</div>

               }
        
        {!selectedUser && 
        <div className='w-full h-full relative overflow-hidden flex flex-col justify-center items-center animate-fadeIn'>
          <img src="/chat.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-20 pointer-events-none select-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-200 dark:to-slate-900 opacity-80 pointer-events-none" />
          <h1 className="relative z-10 text-gray-700 dark:text-gray-200 font-bold text-[50px] text-center">Welcome to GupShup</h1>
          <span className='relative z-10 text-gray-600 dark:text-gray-300 font-bold text-[30px] text-center'>Your Space to Gup All Day!</span>
          </div>}

          {selectedUser &&  <div className='w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center'>
            <img src={frontendImage} alt="" className='w-[80px] absolute bottom-[100px] right-[20%] rounded-lg shadow-grey-400 shadow-lg'/>

            <form className='w-[95%] lg:w-[70%] h-[60px] bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 shadow-lg dark:shadow-xl rounded-full flex items-center gap-[20px] px-[20px] relative' onSubmit={handleSendMessage}>

              {/* Emoji Picker */}
              <div onClick={()=> setShowPicker(prev=>!prev)}>
                <RiEmojiStickerLine className='w-[25px] h-[25px] text-white cursor-pointer'/>
              </div>

              {/* Attachment Icon */}
              <div className='relative'>
                <RiAttachment2 className='w-[25px] h-[25px] text-white cursor-pointer rotate-45' onClick={()=>setShowAttach(prev=>!prev)} />
                {showAttach && (
                  <div className='absolute bottom-[40px] left-[-10px] flex flex-col gap-3 bg-white p-3 rounded-xl shadow-lg z-50 min-w-[120px]'>
                    <div className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded' onClick={()=>{image.current.click(); setShowAttach(false);}}>
                      <FaImages className='text-[#1797c2] w-5 h-5' /> <span className='text-sm text-gray-700'>Image</span>
                    </div>
                    <div className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded'>
                      <MdVideoLibrary className='text-[#1797c2] w-5 h-5' /> <span className='text-sm text-gray-700'>Video</span>
                    </div>
                    <div className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded'>
                      <MdAudiotrack className='text-[#1797c2] w-5 h-5' /> <span className='text-sm text-gray-700'>Audio</span>
                    </div>
                    <div className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded'>
                      <FaPollH className='text-[#1797c2] w-5 h-5' /> <span className='text-sm text-gray-700'>Poll</span>
                    </div>
                    <div className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded' onClick={()=>{documentInput.current.click(); setShowAttach(false);}}>
                      <FaFileAlt className='text-[#1797c2] w-5 h-5' /> <span className='text-sm text-gray-700'>Document</span>
                    </div>
                  </div>
                )}
              </div>

              <input type="file" accept='image/*' ref={image} hidden onChange={handleImage} />
              <input type="file" accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.csv' ref={documentInput} hidden onChange={handleDocument} />
              <input type="text"  className='w-full h-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-white' placeholder='Type a message...' onChange={(e)=>setInput(e.target.value)} value={input}/>
              {/* Document preview */}
              {frontendDoc && (
                <span className='ml-2 px-2 py-1 bg-white text-[#1797c2] rounded text-xs font-semibold'>{frontendDoc}</span>
              )}
              {/* Old image icon replaced by attachment popup */}
              <button>
                <RiSendPlane2Fill className='w-[25px] h-[25px] text-white cursor-pointer'/>
              </button>
            </form>

            </div>  }

        {/* Full-screen image modal */}
        {modalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setModalImage(null)}>
            <button
              className="absolute top-6 right-8 text-white text-3xl font-bold bg-black/60 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 z-60"
              style={{zIndex: 60}}
              onClick={e => { e.stopPropagation(); setModalImage(null); }}
              aria-label="Close image modal"
            >
              &times;
            </button>
            <img src={modalImage} alt="Full" className="max-w-full max-h-full rounded-lg shadow-2xl" />
          </div>
        )}
    </div>
  )
}

export default MessageArea

