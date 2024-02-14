import { createSlice } from '@reduxjs/toolkit';

export const axLegendSlice = createSlice({
    name: 'axLegend',
    initialState: {
        axLegendButtonClicked: false,
    },
    reducers: {
        renderAxLegend: (state) => {
            state.axLegendButtonClicked = true;
        }
    }
})

export const { renderAxLegend } = axLegendSlice.actions;

export default axLegendSlice.reducer;