import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cart-slice";
import authSlice, { initializeAuthState } from "./auth-slice";
import generalSlice from "./general-slice";

const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        auth: authSlice.reducer,
        general: generalSlice.reducer,
    },
});

store.dispatch(initializeAuthState());

export default store;
export type AppDispatch = typeof store.dispatch;
