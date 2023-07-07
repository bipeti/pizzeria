import { createSlice } from "@reduxjs/toolkit";
import { getUserToken } from "../components/utils/token";

export interface UserState {
    isLoggedIn: boolean;
}

const initialToken = getUserToken();

const initialState: UserState = {
    isLoggedIn: initialToken !== null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state) => {
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.isLoggedIn = false;
        },
    },
});

export const userActions = userSlice.actions;

export default userSlice;
