interface IError {
    details: object,
    message: string,
    name: string,
    status: number,
}

export interface IAuthError {
    status: number,
    data: {
        data: object,
        error: IError,
    }
}