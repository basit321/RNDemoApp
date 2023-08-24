import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        user: null,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        resetAuth: (state) => {
            state.token = null;
            state.user = null;
        },
    },
});

export const {
    setToken,
    setUser,
} = authSlice.actions;
export default authSlice.reducer;