import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import { IPost } from "@/types/Post";

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
        overwritePosts: (state, { payload }: PayloadAction<{ posts: IPost[] }>) => {
            state.list = payload.posts;
        },
        updatePost: (state, {payload}: PayloadAction<{post: IPost}>) => {
            const index = state.list.findIndex((post: IPost) => post.id === payload.post.id)
            if(index !== -1){
                state.list[index] = payload.post
            }
        },
        deletePost: (state, {payload}: PayloadAction<{postId: number}>) => {
            state.list = state.list.filter((post: IPost) => post.id !== payload.postId);
        },
        incrementCommentCount: (state, {payload}: PayloadAction<{postId: number}>) => {
            state.list = state.list.map((post: IPost) => post.id === payload.postId ? ({...post, commentCount: post.commentCount + 1}) : post)
        },
        updatePostsIsFriend: (state, { payload }: PayloadAction<{ friendId: number; isFriend: boolean }>) => {
            state.list = state.list.map(post =>
                post.user.id === payload.friendId
                ? { ...post, isFriend: payload.isFriend }
                : post
            );
        }
    }
});

export const { setPost, setPosts, overwritePosts, updatePost, deletePost, incrementCommentCount, updatePostsIsFriend } = postSlice.actions;

export default postSlice.reducer;