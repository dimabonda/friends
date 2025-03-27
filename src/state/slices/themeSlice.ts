import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
    mode: string;
}

const initialState: ThemeState = {
    mode: localStorage.getItem('friends-theme') || 'light',
}

const themeSlice = createSlice({
    name: 'theme',
    initialState: initialState,
    reducers: {
        toggleMode(state){
            state.mode = state.mode === "light" ? "dark" : "light"
        }
    }
});

export const { toggleMode } = themeSlice.actions;

export default themeSlice.reducer;