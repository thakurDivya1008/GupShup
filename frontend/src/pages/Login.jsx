import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { serverUrl } from '../main';
import { useDispatch} from 'react-redux';
import { setUserData } from '../redux/userSlice';

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
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
        <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-grey-400 shadow-lg flex flex-col gap-[30px]'>
            <div className='w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-grey-400 shadow-lg flex items-center justify-center'>
                <h1 className='text-grey-600 font-bold text-[30px]'>Login to <span className='text-white'>GupShup</span></h1>
            </div>
            <form className='w-full flex flex-col gap-[20px] items-center' onSubmit={handleLogin}>
                
                <input type="email" placeholder='email' className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg  shadow-grey-400 shadow-lg text-grey-700 text-[19px]' onChange={(e)=> setEmail(e.target.value)} value={email}/>
                <div className='w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-grey-200 shadow-lg relative'>
                    <input type={`${show?"text":"password"}`} placeholder='password' className=' w-full h-full outline-none px-[20px] py-[10px] bg-[white] text-grey-700 text-[19px]'

                    onChange={(e) =>setPassword(e.target.value)} value={password}
                    />


                    <span className='absolute top-[10px] right-[20px] text-[19px] text-[#20c7ff] font-semibold cursor-pointer' onClick={() => setShow(prev=>!prev)}>{`${show?"hidden":"show"}`}</span>
                </div>
                
             {err && <p className='text-red-500'>{err}</p>}
                <button className='px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-grey-400 shadow-lg text-[20px] w-[200px] mt-[20px]font-semibold hover:shadow-inner'disabled={loading}>{loading ? "Loading..": "Login"}</button>
                <p className='cursor-pointer' onClick={()=>navigate("/signup")}>Want to create a new Account ? <span className='text-[#20c7ff] font-[semibold]'>sign up</span></p>
            </form>
        </div>



    </div>
  )
}

export default Login