import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import themeReducer from "@/state/slices/themeSlice";
import { authApi } from '@/state/api/authApi';
import { postApi } from '@/state/api/postApi';
import { userApi } from '@/state/api/userApi';
import { commentApi } from '@/state/api/commentApi';
import authReducer from '@/state/slices/authSlice';
import postReducer from '@/state/slices/postSlice';
import commentReducer from '@/state/slices/commentSlice';


export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        post: postReducer,
        comment: commentReducer,
        [authApi.reducerPath]: authApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [commentApi.reducerPath]: commentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware, 
            postApi.middleware, 
            userApi.middleware,
            commentApi.middleware,
        ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
