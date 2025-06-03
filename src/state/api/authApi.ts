import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '@/types/User';
import { setCredentials } from '@/state/slices/authSlice';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;


interface ILoginRequest {
    identifier: string;
    password: string;
}

interface ILoginResponse {
    jwt?: string;
    user: IUser;
}

interface IRegisterResponse {
    user: IUser;
    message: string;
}

interface IConfirmUserRequest {
    email: string;
    pin: string;
}

interface IConfirmUserResponse {
    jwt: string;
    user: IUser;
    message: string;
}

interface ISentPinRequest {
    email: string;
}

interface ISentPinResponse {
    message: "string";
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
                    if(data && data.user && data.jwt){
                        dispatch(setCredentials({token: data.jwt, user: data.user}));
                    }
                } catch (err) {
                    console.error('Error fetching user:', err);
                }
            },
        }),
        confirmUser: builder.mutation<IConfirmUserResponse, IConfirmUserRequest>({
            query: (data) => ({
                url: '/api/auth/pin-submit',
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
        sentPin: builder.mutation<ISentPinResponse, ISentPinRequest>({
            query: (data) => ({
                url: '/api/auth/pin-request',
                method: 'POST',
                body: data,
            })
        })
        
    })
})

export const { 
    useRegisterMutation,
    useLoginMutation,
    useConfirmUserMutation,
    useSentPinMutation,
} = authApi;
