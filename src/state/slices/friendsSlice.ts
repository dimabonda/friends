import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import { IFriendListItem } from "@/types/Friend";

interface FriendState {
    list: IFriendListItem[],
    hasMore: boolean,
}

const initialState: FriendState = {
    list: [],
    hasMore: true,
}

const friendsSlice = createSlice({
    name: 'friend',
    initialState: initialState,
    reducers: {
        setFriends: (state, { payload}: PayloadAction<{friends: IFriendListItem[], hasMore: boolean}>) => {
            state.list = [...state.list, ...payload.friends]
            state.hasMore = payload.hasMore;
        },
        overwriteFriend: (state, { payload }: PayloadAction<{friends: IFriendListItem[],  hasMore: boolean}>) => {
            state.list = payload.friends;
            state.hasMore = payload.hasMore;
        },
        updateFriendsList: (state, { payload }: PayloadAction<{ friend: IFriendListItem; isFriend: boolean }>) => {
            if (payload.isFriend){
                state.list = [payload.friend, ...state.list]
            } else {
                state.list = state.list.filter(friend => friend.id !== payload.friend.id)
            }
        }
    }
});

export const { setFriends, overwriteFriend, updateFriendsList } = friendsSlice.actions;

export default friendsSlice.reducer;