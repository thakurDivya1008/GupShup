// import axios from "axios";
// import { useEffect } from "react";
// import { serverUrl } from "../main";
// import { useDispatch, useSelector } from "react-redux";
// import { setOtherUsers } from "../redux/userSlice";



// const GetOtherUsers=()=>{
//     let dispatch = useDispatch();
//     let {userData} = useSelector(state=>state.user)
//     useEffect(() => {
//         const fetchUser=async ()=>{
//             try {
//                 let result=await axios.get(`${serverUrl}/api/user/other`, {withCredentials:true})
//                 dispatch(setOtherUsers(result.data))
//             } catch (error) {
//                 console.log(error);
                
//             }
//         }

//         fetchUser();
// }, [userData])
// }

// export default GetOtherUsers;

// useGetOtherUsers.js
import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/other`, {
          withCredentials: true,
        });
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.error("Error fetching other users:", error);
      }
    };

    if (userData) fetchUser();
  }, [dispatch, userData]);
};

export default useGetOtherUsers;
