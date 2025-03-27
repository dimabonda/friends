import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import themeReducer from "state/slices/themeSlice";
import { authApi } from 'state/api/authApi';
import { postApi } from 'state/api/postApi';
import { userApi } from 'state/api/userApi';
import authReducer from 'state/slices/authSlice';
import postReducer from 'state/slices/postSlice';


export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        post: postReducer,
        [authApi.reducerPath]: authApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, postApi.middleware, userApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
