//Import store from redux tool kit
import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from './RTKslices'

//Export Store 
export const store = configureStore({
    reducer: {
        main: mainSlice.reducer,
    },
    middleware: (getDefaultMiddleware =>
        getDefaultMiddleware({serializableCheck: false })),
});