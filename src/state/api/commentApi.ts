import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setComments, setComment, updateCommet } from '@/state/slices/commentSlice';
import { incrementCommentCount } from '@/state/slices/postSlice';
import { IComment } from '@/types/Comment';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

interface ICreateCommentRequest {
    postId: string,
    text: string,
}

interface ICommentResponse {
    message: string,
    data: IComment
}

interface ICommentListRequest {
    postId: string,
    lastCommentId: number | null | undefined;
    pageSize: number;
}

interface ICommentListResponse {
    message: string,
    data: {
        comments: IComment[],
        hasMore: boolean,
    },
}

interface ILikeCommentRequest {
    commentId: string,
}

export const commentApi = createApi({
    reducerPath: "commentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createComment: builder.mutation<ICommentResponse, ICreateCommentRequest>({
            query: (data) => ({
                url: 'api/comments/create',
                method: 'POST',
                body: data
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    const comment = data?.data;
                    if(comment && comment.post && comment.post.id){
                        dispatch(setComment({comment}));
                        dispatch(incrementCommentCount({postId: comment.post.id}));
                    }

                } catch (err) {
                    console.error('Error creating comment:', err);
                }
            }
        }),
        getList: builder.query<ICommentListResponse, ICommentListRequest>({
            query: ({ postId, lastCommentId,  pageSize, }) => ({
                url: `api/comments/${postId}/list?pageSize=${pageSize}&lastCommentId=${lastCommentId}`,
                method: "GET",
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    const comments = data?.data?.comments;
                    if(comments.length > 0 && comments[0]?.post?.id){
                        dispatch(setComments({comments, postId: comments[0].post.id}))
                    }

                } catch (err) {
                    console.error('Error fetching comment list:', err);
                }
            },
        }),
        likeComment: builder.mutation<ICommentResponse, ILikeCommentRequest>({
            query: ({ commentId }) => ({
                url: `api/comments/${commentId}/like`,
                method: 'POST',
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;

                    const comment = data?.data;
                    if(comment && comment.post && comment.post.id){
                        dispatch(updateCommet({comment}));
                    }

                } catch (err) {
                    console.error('Error liking comment:', err);
                }
            }
        })
    })
})

export const {
    useCreateCommentMutation,
    useGetListQuery,
    useLikeCommentMutation,
} = commentApi