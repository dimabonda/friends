import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from 'types/User';
import { IFriend } from 'types/Friend';
import { setCredentials, updateUserFriends } from 'state/slices/authSlice';

const BASE_URL = process.env.REACT_APP_API_URL;

interface IMeResponse {
    jwt: string;
    user: IUser;
}

interface IFollowRequest {
    userId: string;
}

interface IFollowResponse {
    message: string;
    friend: IFriend;
    isFriend: boolean;
}

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken');
            if (token ) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        me: builder.query<IMeResponse, void>({
            query: () => {
                return {
                    url: '/api/user/me',
                    method: 'GET',
                }
            },
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({token: data.jwt, user: data.user}));
                } catch (err) {
                    console.error('Error fetching user:', err);
                }
            },
        }),
        follow: builder.mutation<IFollowResponse, IFollowRequest>({
            query: ({userId}) => ({
                url: `/api/user/${userId}/follow`,
                method: 'POST',
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateUserFriends({isFriend: data.isFriend, friend: data.friend}))
                } catch (err) {
                    console.error('Error updating user:', err);
                }
            },
        })
    })
})

export const { useMeQuery, useFollowMutation } = userApi;