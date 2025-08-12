import React from 'react'
import { formatTimestamp } from '../utils/dateUtils'

const SenderMessage = ({ image, message, seen, onImageClick, currentUserId, createdAt }) => {
  
  const isSeenByOther = Array.isArray(seen) && seen.some(uid => String(uid) !== String(currentUserId));
  let tick;
  if (isSeenByOther) {
    tick = <span title="Seen" style={{ color: 'white', fontSize: 18 }}>✔</span>;
  } else {
    tick = <span title="Sent" style={{ color: 'white', fontSize: 18 }}>✔✔</span>;
  }
  
  return (
    <div className='self-end w-fit max-w-[500px] bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 text-white px-[20px] py-[10px] rounded-tr-none rounded-2xl shadow-lg dark:shadow-xl gap-[10px] flex flex-col animate-fadeIn hover-lift'>
      {image && <img src={image} alt="" className='w-[100px] rounded-lg shadow-md cursor-pointer' onClick={() => onImageClick && onImageClick(image)} />}
      {message && <span className='text-sm'>{message}</span>}
      <div className="flex justify-end items-center gap-2 mt-1">
        <span className="text-xs opacity-50">{formatTimestamp(createdAt)}</span>
        {tick}
      </div>
    </div>
  )
}

export default SenderMessage