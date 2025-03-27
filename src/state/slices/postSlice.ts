import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import { IPost } from "types/Post";

interface PostState {
    list: IPost[]
}

const initialState: PostState = {
    list: []
}

const postSlice = createSlice({
    name: 'post',
    initialState: initialState,
    reducers: {
        setPost: (state, {payload}: PayloadAction<{post: IPost}>) => {
            state.list = [payload.post, ...state.list]
        },
        setPosts: (state, { payload}: PayloadAction<{posts: IPost[]}>) => {
            state.list = [...state.list, ...payload.posts]
        }, 
        updatePost: (state, {payload}: PayloadAction<{post: IPost}>) => {
            const index = state.list.findIndex((post: IPost) => post.id === payload.post.id)
            if(index !== -1){
                state.list[index] = payload.post
            }
        }
    }
});

export const { setPost, setPosts, updatePost } = postSlice.actions;

export default postSlice.reducer;