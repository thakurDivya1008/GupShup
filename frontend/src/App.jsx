import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import GetCurrentUser from './customHooks/GetCurrentUser';
import {useSelector } from 'react-redux';
import Profile from './pages/Profile';
import Home from './pages/Home';
import UseGetOtherUsers from './customHooks/UseGetOtherUsers';


const App = () => {
  GetCurrentUser();
  UseGetOtherUsers();
  const { userData } = useSelector(state => state.user);
  
  // const dispatch = useDispatch();
  
//   useEffect(() => {
//     if (userData?._id) {
//     socket.connect();
//     socket.emit("join", userData._id); 
//   }

//   socket.on("receive-message", (message) => {
//     console.log("Message received:", message);
//     dispatch(addMessage(message)); 
//   });

//   return () => {
//     socket.disconnect();
//     socket.off("receive-message");
//   };
// }, [userData]);


  
  
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
