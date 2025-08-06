import React from 'react'
import SideBar from '../components/Sidebar'
import MessageArea from '../components/MessageArea'
import UsegetMessage from '../customHooks/GetMessages'

const Home = () => {
  UsegetMessage();
  return (
    <div className='w-full h-[100vh] flex overflow-hidden'>
      <SideBar/>
      <MessageArea/>
    </div>
  )
}

export default Home