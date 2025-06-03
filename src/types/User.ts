export interface IUser {
    id: number;
    username: string;
    firstName: string
    lastName: string;
    email: string;
    location: string;
    occupation: string;
    confirmed: boolean,
    blocked: boolean,
    role: object,
    photo: {url: string},
    friendsCount: number,
}

export interface IUserListItem{
    id: number;
    firstName: string;
    lastName: string;
    location: string;
    photo: {
        url: string;
    };
    cursor: number;
    isFriend: boolean;
}