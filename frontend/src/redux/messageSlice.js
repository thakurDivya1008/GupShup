import { createSlice } from "@reduxjs/toolkit";


const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: []
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      const idx = state.messages.findIndex(m => m._id === action.payload._id);
      let oldSeen = [];
      if (idx !== -1 && Array.isArray(state.messages[idx].seen)) {
        oldSeen = state.messages[idx].seen.map(String);
      }
      const newSeen = Array.isArray(action.payload.seen) ? action.payload.seen.map(String) : [];
      if (idx !== -1) {
        state.messages[idx] = {
          ...state.messages[idx],
          ...action.payload,
          seen: Array.from(new Set([...oldSeen, ...newSeen]))
        };
      } else {
        state.messages.push({ ...action.payload, seen: newSeen });
      }
    }
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;

