import React from 'react'

const RecieverMessage = ({image,message}) => {
  return (
    <div className='w-fit max-w-[500px] bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 text-white px-[20px] py-[10px] rounded-tl-none rounded-2xl relative left-0 shadow-lg dark:shadow-xl gap-[10px] flex flex-col animate-fadeIn hover-lift'>

         {image && <img src={image} alt="" className='w-[100px] rounded-lg shadow-md' />}
        {message && <span className='text-sm'>{message}</span>}
        
    </div>
  )
}

export default RecieverMessage