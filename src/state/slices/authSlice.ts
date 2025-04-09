import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '@/types/User';
import { IFriend } from '@/types/Friend';

interface IAuthState {
    token: string | null;
    user: IUser | null; 
    isAuthenticated: boolean;
}

const initialState: IAuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, {payload}: PayloadAction<{token: string, user: IUser}>) => {
            state.token = payload.token;
            state.user = payload.user;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
        }, 
        updateUserFriends: (state, {payload}: PayloadAction<{isFriend: boolean, friend: IFriend}>) => {
            if (state.user){
                if (payload.isFriend){
                    state.user.friends = [...state.user.friends, {id: payload.friend.id, username: payload.friend.username}]
                } else {
                    state.user.friends = state.user.friends.filter(friend => friend.id !== payload.friend.id)
                }
            }
        }
    }
})

export const { setCredentials, logout, updateUserFriends } = authSlice.actions;
export default authSlice.reducer

