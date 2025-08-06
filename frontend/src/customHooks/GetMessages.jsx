import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
    const dispatch = useDispatch();
    const { userData, selectedUser } = useSelector(state => state.user);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                let result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, { withCredentials: true });
                dispatch(setMessages(result.data));
            } catch (error) {
                console.log(error);
            }
        };
        fetchMessage();
    }, [selectedUser, userData]);
};

export default useGetMessages;