import React from 'react'
import dp from "../assets/dp.jpg"

// For non-self messages; shows sender avatar/name in group chats (WhatsApp-like)
const RecieverMessage = ({ image, message, sender, isGroup = false }) => {
  const avatar = sender?.image || dp;
  const displayName = sender?.name || sender?.userName || (isGroup ? 'Member' : '');

  return (
    <div className='flex items-start gap-2 animate-fadeIn'>
      {isGroup && (
        <div className='w-7 h-7 rounded-full overflow-hidden flex-shrink-0 shadow-md bg-white dark:bg-slate-600'>
          <img src={avatar} alt={displayName} className='w-full h-full object-cover' />
        </div>
      )}

      <div className='w-fit max-w-[500px] bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 text-white px-[14px] py-[10px] rounded-tl-none rounded-2xl shadow-lg dark:shadow-xl gap-[6px] flex flex-col hover-lift'>
        {isGroup && (
          <span className='text-[11px] font-semibold opacity-90'>{displayName}</span>
        )}
        {image && <img src={image} alt="" className='w-[120px] rounded-lg shadow-md' />}
        {message && <span className='text-sm leading-5'>{message}</span>}
      </div>
    </div>
  )
}

export default RecieverMessage