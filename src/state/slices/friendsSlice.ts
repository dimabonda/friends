import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import { IFriendListItem } from "@/types/Friend";

interface FriendState {
    list: IFriendListItem[]
}

const initialState: FriendState = {
    list: []
}

const friendsSlice = createSlice({
    name: 'friend',
    initialState: initialState,
    reducers: {
        // setPost: (state, {payload}: PayloadAction<{post: IPost}>) => {
        //     state.list = [payload.post, ...state.list]
        // },
        setFriends: (state, { payload}: PayloadAction<{friends: IFriendListItem[]}>) => {
            state.list = [...state.list, ...payload.friends]
        }, 
        // updatePost: (state, {payload}: PayloadAction<{post: IPost}>) => {
        //     const index = state.list.findIndex((post: IPost) => post.id === payload.post.id)
        //     if(index !== -1){
        //         state.list[index] = payload.post
        //     }
        // },
        // deletePost: (state, {payload}: PayloadAction<{postId: number}>) => {
        //     state.list = state.list.filter((post: IPost) => post.id !== payload.postId);
        // },
        // incrementCommentCount: (state, {payload}: PayloadAction<{postId: number}>) => {
        //     state.list = state.list.map((post: IPost) => post.id === payload.postId ? ({...post, commentCount: post.commentCount + 1}) : post)
        // },
        updateFriendsList: (state, { payload }: PayloadAction<{ friend: IFriendListItem; isFriend: boolean }>) => {
            if (payload.isFriend){
                state.list = [payload.friend, ...state.list]
            } else {
                state.list = state.list.filter(friend => friend.id !== payload.friend.id)
            }
        }
    }
});

export const { setFriends, updateFriendsList } = friendsSlice.actions;

export default friendsSlice.reducer;