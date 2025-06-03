import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser, IUserListItem } from '@/types/User';
import { IFriend, IFriendListItem } from '@/types/Friend';
import { logout, setCredentials, updateUserFriends } from '@/state/slices/authSlice';
import { updatePostsIsFriend } from '@/state/slices/postSlice';
import { setFriends, overwriteFriend, updateFriendsList } from '@/state/slices/friendsSlice';
import { overwriteUsers, setUsers } from '@/state//slices/userSlice';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

interface IMeResponse {
    jwt: string;
    user: IUser;
}

interface IFollowRequest {
    userId: string;
}

interface IFollowResponse {
    message: string;
    friend: IFriendListItem;
    isFriend: boolean;
}

interface IFriendsListRequest {
    lastCursor: number | null;
    pageSize: number;
    userId: number;
}

interface IFriendsListResponse {
    hasMore: boolean;
    friends: IFriendListItem[];
}

interface IGetUserProfileRequest {
    userId: string;
}
interface IGetUserProfileResponse {
    user: IUser;
}

interface IGetUserListRequest {
    query: string;
    pageSize: number;
    lastCursor: number | null;
}

interface IGetUserListResponse {
    hasMore: boolean;
    users: IUserListItem[];
    totalCount: number;
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
                    dispatch(logout());
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
                    dispatch(updateUserFriends({isFriend: data.isFriend}))
                    dispatch(updatePostsIsFriend({isFriend: data.isFriend, friendId: data.friend.id}))
                    dispatch(updateFriendsList({friend: data.friend, isFriend: data.isFriend}));
                } catch (err) {
                    console.error('Error updating user:', err);
                }
            },
        }),
        getFriendsList: builder.query<IFriendsListResponse, IFriendsListRequest>({
            query: ({lastCursor, pageSize, userId}) => {
                let url = `api/user/${userId}/friends?pageSize=${pageSize}`
                if (lastCursor) {
                    url = `${url}&lastCursor=${lastCursor}`;
                }
                return {
                    url,
                    method: "GET",
                }
            },
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    const friends = data.friends;

                    if (args.lastCursor === null) {
                        dispatch(overwriteFriend({friends}));
                    } else {
                        dispatch(setFriends({friends}));
                    }

                } catch (err) {
                    console.error('Error fetching post list:', err);
                }
            },
        }),
        getUserProfile: builder.query<IGetUserProfileResponse, IGetUserProfileRequest>({
            query: ({userId}) => ({
                url: `/api/user/${userId}/profile`,
                method: 'GET',
            }),
        }),
        getUserList: builder.query<IGetUserListResponse, IGetUserListRequest>({
            query: ({query, pageSize, lastCursor}) => {
                let url = `/api/user/search/all-users?pageSize=${pageSize}&query=${query}`
                if (lastCursor) {
                    url = `${url}&lastCursor=${lastCursor}`;
                }
                return {
                    url,
                    method: 'GET',
                }
            },
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    const users = data.users;
                    const count = data.totalCount;

                    if (args.lastCursor === null) {
                        dispatch(overwriteUsers({users, count}));
                    } else {
                        dispatch(setUsers({users, count}));
                    }

                } catch (err) {
                    console.error('Error fetching post list:', err);
                }
            },
        })    
    })
})

export const { 
    useMeQuery, 
    useFollowMutation, 
    useGetFriendsListQuery, 
    useGetUserProfileQuery,
    useGetUserListQuery,
} = userApi;