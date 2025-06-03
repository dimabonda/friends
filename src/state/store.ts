import { configureStore, combineReducers, createAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import themeReducer from "@/state/slices/themeSlice";
import { authApi } from '@/state/api/authApi';
import { postApi } from '@/state/api/postApi';
import { userApi } from '@/state/api/userApi';
import { commentApi } from '@/state/api/commentApi';
import authReducer from '@/state/slices/authSlice';
import postReducer from '@/state/slices/postSlice';
import commentReducer from '@/state/slices/commentSlice';
import friendReducer from '@/state/slices/friendsSlice';
import userReducer from '@/state/slices/userSlice';

const appReducer = combineReducers({
    auth: authReducer,
    post: postReducer,
    comment: commentReducer,
    theme: themeReducer,
    friend: friendReducer,
    users: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
});
  
export type AppState = ReturnType<typeof appReducer>;
  
const rootReducer = (state: AppState | undefined, action: any): AppState => {
    if (action.type === 'app/reset' && state ) {
        const preservedTheme = state.theme;
        const resetState = appReducer(undefined, action);
        return {
            ...resetState,
            theme: preservedTheme,
        };
    }
    return appReducer(state, action);
};


export const store = configureStore({
    reducer: rootReducer,
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

export const resetStateAction = createAction('app/reset');