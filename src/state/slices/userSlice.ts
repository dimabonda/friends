import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import { IUserListItem } from "@/types/User";

interface UsersState {
    list: IUserListItem[],
    count: number,
}

const initialState: UsersState = {
    list: [],
    count: 0,
}

const usersSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        setUsers: (state, { payload}: PayloadAction<{users: IUserListItem[], count: number}>) => {
            state.list = [...state.list, ...payload.users];
            state.count = payload.count;
        },
        overwriteUsers: (state, { payload }: PayloadAction<{users: IUserListItem[], count: number}>) => {
            state.list = payload.users;
        },
        // updateFriendsList: (state, { payload }: PayloadAction<{ friend: IFriendListItem; isFriend: boolean }>) => {
        //     if (payload.isFriend){
        //         state.list = [payload.friend, ...state.list]
        //     } else {
        //         state.list = state.list.filter(friend => friend.id !== payload.friend.id)
        //     }
        // }
    }
});

export const { 
    setUsers,
    overwriteUsers,
} = usersSlice.actions;

export default usersSlice.reducer;