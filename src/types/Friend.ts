export interface IFriend {
    id: number;
    username: string;
}

export interface IFriendListItem {
    id: number;
    firstName: string;
    lastName: string;
    location: string;
    photo: {
        id: number;
        url: string;
    },
    cursor: number;
}