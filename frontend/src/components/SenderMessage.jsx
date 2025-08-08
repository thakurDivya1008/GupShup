import React from 'react'

const SenderMessage = ({image, message}) => {
  return (
    <div className='self-end w-fit max-w-[500px] bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-700 text-white px-[20px] py-[10px] rounded-tr-none rounded-2xl shadow-lg dark:shadow-xl gap-[10px] flex flex-col animate-fadeIn hover-lift'>
        {image && <img src={image} alt="" className='w-[100px] rounded-lg shadow-md' />}
        {message && <span className='text-sm'>{message}</span>}
    
    </div>
  )
}

export default SenderMessage