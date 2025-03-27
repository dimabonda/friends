import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from 'types/User';
import { setCredentials } from 'state/slices/authSlice';

const BASE_URL = process.env.REACT_APP_API_URL;

interface ILoginRequest {
    identifier: string;
    password: string;
}

interface ILoginResponse {
    jwt: string;
    user: IUser;
}

interface IRegisterResponse {
    jwt: string;
    user: IUser;
    message: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    endpoints: (builder) => ({
        register: builder.mutation<IRegisterResponse, FormData>({
            query: (data) => ({
                url: '/api/auth/local/register',
                method: 'POST',
                body: data,
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({token: data.jwt, user: data.user}));
                } catch (err) {
                    console.error('Error fetching user:', err);
                }
            },
        }),
        login: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (data) => ({
                url: '/api/auth/local/login',
                method: 'POST',
                body: data,
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({token: data.jwt, user: data.user}));
                } catch (err) {
                    console.error('Error fetching user:', err);
                }
            },
        }),
    })
})

export const { useRegisterMutation, useLoginMutation } = authApi;
