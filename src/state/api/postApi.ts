import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IPost } from '@/types/Post';
import { setPost, setPosts, overwritePosts, updatePost, deletePost } from '@/state/slices/postSlice';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

interface ICreatePostResponse {
    message: string;
    data: IPost;
}

interface IPostListRequest {
    lastPostId: number | null;
    pageSize: number;
}

interface IPostListByUserRequest{
    lastPostId: number | null;
    pageSize: number;
    userId: number;
}

interface ILikePostRequest {
    postId: string;
}

interface IPostListResponse {
    message: string;
    data: {
        posts: IPost[];
        hasMore: boolean;
    };
}

interface IPostResponse {
    message: string;
    data: IPost;
}




export const postApi = createApi({
    reducerPath: 'postApi',
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
        createPost: builder.mutation<ICreatePostResponse, FormData>({
            query: (data) => ({
                url: 'api/post/create',
                method: 'POST',
                body: data
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    const post = data?.data;
                    dispatch(setPost({post}));
                } catch (err) {
                    console.error('Error fetching user:', err);
                }
            },
        }),
        getPost: builder.query<IPost, {id: string}>({
            query: ({id}) => ({
                url: `api/post/${id}`,
                method: 'GET',
            })
        }),
        getList: builder.query<IPostListResponse, IPostListRequest>({
            query: ({lastPostId, pageSize}) => ({
                url: `api/post/posts/list?lastPostId=${lastPostId}&pageSize=${pageSize}`,
                method: "GET",
            }),
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    const posts = data?.data?.posts;

                    args.lastPostId === null
                        ? dispatch(overwritePosts({ posts }))
                        : dispatch(setPosts({ posts }))

                } catch (err) {
                    console.error('Error fetching post list:', err);
                }
            },
        }),
        getByUserList: builder.query<IPostListResponse, IPostListByUserRequest>({
            query: ({lastPostId, pageSize, userId}) => ({
                url: `api/post-list/all?lastPostId=${lastPostId}&pageSize=${pageSize}&userId=${userId}`,
                method: "GET",
            }),
             onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    const posts = data?.data?.posts;

                    args.lastPostId === null
                        ? dispatch(overwritePosts({ posts }))
                        : dispatch(setPosts({ posts }))

                } catch (err) {
                    console.error('Error fetching post list:', err);
                }
            },
        }),
        likePost: builder.mutation<IPostResponse, ILikePostRequest>({
            query: ({postId}) => ({
                url: `api/post/${postId}/like`,
                method: "POST",
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    const post = data?.data;
                    if (post){
                        dispatch(updatePost({post}));
                    }
                    
                } catch (err) {
                    console.error('Error like:', err);
                }
            },
        }),
        deletePost: builder.mutation<IPostResponse, {postId: string}>({
            query: ({postId}) => ({
                url: `api/post/${postId}`,
                method: "DELETE",
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {    
                try {
                    const { data } = await queryFulfilled;
                    const post = data?.data;
                    if (post && post.id){
                        dispatch(deletePost({postId: post.id}));
                    }
                    
                } catch (err) {
                    console.error('Error like:', err);
                }
            }   
        }),
    })
});

export const {
    useCreatePostMutation,
    useGetListQuery,
    useGetPostQuery,
    useGetByUserListQuery,
    useLikePostMutation,
    useDeletePostMutation,
} = postApi;