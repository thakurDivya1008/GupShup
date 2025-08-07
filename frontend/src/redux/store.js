import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import messageSlice from "./messageSlice";
import conversationReducer from "./conversationSlice";

export const store=configureStore({
    reducer:{
        user: userSlice,
        message: messageSlice,
        conversations: conversationReducer
    }
})