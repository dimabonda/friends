import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import { IComment } from "@/types/Comment";

interface CommentsState {
    list: Record<number, IComment[]>;
}

const initialState: CommentsState = {
    list: {
        
    }
}

const commentSlice = createSlice({
    name: 'comment',
    initialState: initialState,
    reducers: {
        setComment: (state, {payload}: PayloadAction<{comment: IComment}>) => {
            const postId = payload.comment.post.id;
            if(!state.list[postId]){
                state.list[postId] = []
            }
            state.list[postId] = [payload.comment, ...state.list[postId]]
        },
        setComments: (state, { payload}: PayloadAction<{comments: IComment[], postId: number}>) => {
            state.list[payload.postId] = [...(state.list[payload.postId] || []), ...payload.comments]
        }, 
        updateCommet: (state,{ payload }: PayloadAction<{comment: IComment}>) => {
            const updatedComment = payload.comment;
            const postId = updatedComment.post.id;
            
            const comments = state.list[postId];
            if (!comments) return;
            state.list[postId] = comments.map((comment) => 
                comment.id === updatedComment.id ? updatedComment : comment
            )
        }

    }
});

export const { setComments, setComment, updateCommet } = commentSlice.actions;

export default commentSlice.reducer;