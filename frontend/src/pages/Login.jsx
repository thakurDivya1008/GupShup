import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { serverUrl } from '../main';
import { useDispatch} from 'react-redux';
import { setUserData } from '../redux/userSlice';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  let navigate = useNavigate();
  let [show,setShow]= useState(false);
  let [email,setEmail]=useState("");
  let [password,setPassword]=useState("");
  let [loading,setLoading]=useState(false);
  let [err,setError]= useState("");
  let dispatch= useDispatch();
//   let userData = useSelector(state=>state.user)
//   console.log("userdata:",userData);
  

    

    const handleLogin=async (e)=>{
            e.preventDefault();
            setLoading(true);
            try{
            let result = await axios.post(`${serverUrl}/api/auth/login`,{
             email,password
            },{withCredentials:true})
            //  console.log(result);

            dispatch(setUserData(result.data))
            navigate("/")
             setEmail("");
             setPassword("");
             setLoading(false);
             
             setError("");
            } catch(error){
               console.log(error);
               setLoading(false);
               setError(error.response.data.message)
            }
        }
  return (
    <div className='w-full h-[100vh] bg-slate-200 dark:bg-slate-900 flex items-center justify-center animate-fadeIn'>
        <div className='w-full max-w-[500px] h-[600px] bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-2xl flex flex-col gap-[30px] hover-lift'>
            <div className='w-full h-[200px] bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 rounded-b-[30%] shadow-lg flex items-center justify-center relative'>
                <div className='absolute top-4 right-4'>
                    <ThemeToggle />
                </div>
                <h1 className='text-white font-bold text-[30px] animate-fadeIn'>Login to <span className='text-cyan-200'>GupShup</span></h1>
            </div>
            <form className='w-full flex flex-col gap-[20px] items-center' onSubmit={handleLogin}>
                
                <input type="email" placeholder='email' className='w-[90%] h-[50px] outline-none border-2 border-cyan-500 dark:border-cyan-400 px-[20px] py-[10px] bg-white dark:bg-slate-700 rounded-lg shadow-lg dark:shadow-xl text-gray-700 dark:text-gray-200 text-[19px] focus:border-cyan-600 dark:focus:border-cyan-300 transition-all duration-300' onChange={(e)=> setEmail(e.target.value)} value={email}/>
                <div className='w-[90%] h-[50px] border-2 border-cyan-500 dark:border-cyan-400 overflow-hidden rounded-lg shadow-lg dark:shadow-xl relative'>
                    <input type={`${show?"text":"password"}`} placeholder='password' className='w-full h-full outline-none px-[20px] py-[10px] bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-[19px] focus:border-cyan-600 dark:focus:border-cyan-300 transition-all duration-300'

                    onChange={(e) =>setPassword(e.target.value)} value={password}
                    />


                    <span className='absolute top-[10px] right-[20px] text-[19px] text-cyan-500 dark:text-cyan-400 font-semibold cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors duration-200' onClick={() => setShow(prev=>!prev)}>{`${show?"hidden":"show"}`}</span>
                </div>
                
             {err && <p className='text-red-500 dark:text-red-400 animate-pulse'>{err}</p>}
                <button className='w-[90%] h-[50px] bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 text-white font-semibold text-[19px] rounded-lg shadow-lg dark:shadow-xl hover:from-cyan-600 hover:to-blue-600 dark:hover:from-cyan-700 dark:hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed' disabled={loading}>{loading ? "Loading...": "Login"}</button>
                <p className='text-gray-700 dark:text-gray-300 text-[16px] cursor-pointer' onClick={()=>navigate("/signup")}>Want to create a new Account ? <span className='text-cyan-500 dark:text-cyan-400 font-semibold hover:underline hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors duration-200'>sign up</span></p>
            </form>
        </div>



    </div>
  )
}

export default Login