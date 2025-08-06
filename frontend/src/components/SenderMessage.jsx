import React from 'react'

const SenderMessage = ({image, message}) => {
  return (
    <div className='self-end w-fit max-w-[500px] bg-[rgb(23,151,194)] text-white px-[20px] py-[10px] rounded-tr-none rounded-2xl shadow-grey-500 shadow-lg gap-[10px] flex flex-col'>
        {image && <img src={image} alt="" className='w-[100px] rounded-lg' />}
        {message && <span>{message}</span>}
    
    </div>
  )
}

export default SenderMessage