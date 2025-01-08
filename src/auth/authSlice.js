import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_USER, IS_DEMO } from 'config.js';

const storedValue = localStorage.getItem('token');
const token = JSON.parse(storedValue);
const userLogin = token?.user;

console.log({ ...DEFAULT_USER, role: userLogin?.roles });


const initialState = {
  isLogin: IS_DEMO,
  currentUser: { ...DEFAULT_USER, role: userLogin?.roles },

  // currentUser: IS_DEMO ? DEFAULT_USER : {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      state.isLogin = true;
    },
  },
});

export const { setCurrentUser } = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
