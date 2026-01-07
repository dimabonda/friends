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
            state.count = payload.count;
        },
        updateIsFriendUsersList: (state, { payload }: PayloadAction<{ userId: number; isFriend: boolean }>) => {
            state.list = state.list.map((user) => 
                user.id === payload.userId  
                    ? {...user, isFriend: payload.isFriend}
                    : user
            )
        }
    }
});

export const { 
    setUsers,
    overwriteUsers,
    updateIsFriendUsersList,
} = usersSlice.actions;

export default usersSlice.reducer;