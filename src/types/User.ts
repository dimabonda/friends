import { IFriend } from "@/types/Friend";

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
    friends: IFriend[],
}