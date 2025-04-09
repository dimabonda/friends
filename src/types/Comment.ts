export interface IComment {
    id: number,
    text: string,
    createdAt: string,
    user: {
        id: number,
        firstName: string,
        lastName: string,
        photo: {
            id: 24,
            url: string,
        }
    },
    post: {
        id: number,
    }
}