import React from 'react'
import SideBar from '../components/Sidebar'
import MessageArea from '../components/MessageArea'

const Home = () => {
  return (
    <div className='w-full h-[100vh] flex'>
      <SideBar/>
      <MessageArea/>
    </div>
  )
}

export default Home