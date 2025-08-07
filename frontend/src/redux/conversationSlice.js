import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../main';

// Async thunk to fetch all conversations for the current user
export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${serverUrl}/api/conversation/all`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Remove localStorage unread logic and helpers

const conversationSlice = createSlice({
  name: 'conversations',
  initialState: {
    conversations: [],
    loading: false,
    error: null,
  },
  reducers: {
    addConversation: (state, action) => {
      state.conversations.unshift({ ...action.payload, unread: 0 });
    },
    refreshConversations: (state) => {
      state.loading = true;
    },
    incrementUnread: (state, action) => {
      const conv = state.conversations.find(c => c._id === action.payload);
      if (conv) conv.unread = (conv.unread || 0) + 1;
    },
    resetUnread: (state, action) => {
      const conv = state.conversations.find(c => c._id === action.payload);
      if (conv) conv.unread = 0;
    },
    setUnread: (state, action) => {
      // { id, unread }
      const conv = state.conversations.find(c => c._id === action.payload.id);
      if (conv) conv.unread = action.payload.unread;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        // Use unread from backend
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addConversation, refreshConversations, incrementUnread, resetUnread, setUnread } = conversationSlice.actions;
export default conversationSlice.reducer;
