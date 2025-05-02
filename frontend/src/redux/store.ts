import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adoptReducer from "./slices/adoptSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        adopt: adoptReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;