// import React from 'react'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import SignUp from './pages/SignUp'
// import Login from './pages/Login'
// import GetCurrentUser from './customHooks/GetCurrentUser'
// import { useSelector } from 'react-redux'
// import Profile from './pages/Profile'
// import Home from './pages/Home'
// import UseGetOtherUsers from './customHooks/UseGetOtherUsers'

// const App = () => {
//   GetCurrentUser();
//   UseGetOtherUsers();
//   let {userData}=useSelector(state=>state.user)

  
//   return (


    
//       <Routes>
//         <Route path='/login' element={!userData?<Login/>:<Navigate to="/"/>}/>
//         <Route path='/signup' element={!userData?<SignUp/>:<Navigate to="/profile"/>}/>
//         <Route path='/' element={userData?<Home/>:<Navigate to="/login"/>}/>
//         <Route path='/profile' element={userData?<Profile/>:<Navigate to="/signup"/>}/>
//         {/* <Route path='/' element={<Home/>}/>
//         <Route path='/profile' element={<Profile/>}/> */}
//       </Routes>
    
//   )
// }

// export default App




import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import GetCurrentUser from './customHooks/GetCurrentUser';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile';
import Home from './pages/Home';
import UseGetOtherUsers from './customHooks/UseGetOtherUsers';
import socket from './socket'; 

const App = () => {
  GetCurrentUser();
  UseGetOtherUsers();
  const { userData } = useSelector(state => state.user);

  
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO:", socket.id);
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from Socket.IO");
    };
  }, []);

  return (
    <Routes>
      <Route path='/login' element={!userData ? <Login /> : <Navigate to="/" />} />
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/profile" />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />
      <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/signup" />} />
    </Routes>
  );
};

export default App;
