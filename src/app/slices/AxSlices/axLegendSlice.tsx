import { createSlice } from '@reduxjs/toolkit';

export const axLegendSlice = createSlice({
    name: 'axLegend',
    initialState: {
        axLegendButtonClicked: false,
    },
    reducers: {
        renderAxLegend: (state) => {
            if (!state.axLegendButtonClicked) state.axLegendButtonClicked = true;
            else state.axLegendButtonClicked = false;
        }
    }
})

export const { renderAxLegend } = axLegendSlice.actions;

export default axLegendSlice.reducer;