import { configureStore } from '@reduxjs/toolkit';      //Import store from redux tool kit
import { historySlice } from './RTKslices'

//Export Store 
export const store = configureStore({
    reducer: {
        history: historySlice.reducer
    }
        
});