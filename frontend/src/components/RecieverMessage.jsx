import React from 'react'

const RecieverMessage = ({image,message}) => {
  return (
    <div className='w-fit max-w-[500px] bg-[#20c7ff] text-white px-[20px] py-[10px] rounded-tl-none rounded-2xl relative left-0 shadow-grey-500 shadow-lg gap-[10px] flex flex-col'>

         {image && <img src={image} alt="" className='w-[100px] rounded-lg' />}
        {message && <span>{message}</span>}
        
    </div>
  )
}

export default RecieverMessage