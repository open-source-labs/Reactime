//Import store from redux tool kit
import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from './slices/mainSlice';
import { axLegendSlice } from './slices/AxSlices/axLegendSlice';

//Export Store
export const store = configureStore({
  reducer: {
    main: mainSlice.reducer,
    axLegend: axLegendSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>