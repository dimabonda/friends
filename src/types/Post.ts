import { IComment } from "@/types/Comment";
import { ILike } from "@/types/Like";
export interface IPost {
    id: number,
    title: string,
    createdAt: string,
    user: {
        id: number,
        firstName: string,
        lastName: string,
        location: string,
        photo: {
            id: 24,
            url: string,
        }
    },
    image: {
        id: 27,
        url: string
    },
    likes: ILike[],
    commentCount: string,
    // comments: IComment[]
}