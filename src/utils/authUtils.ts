export const checkTokenValidity = (token: string | null): boolean => {
    if (!token) return false;

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        return currentTime < expirationTime;
    } catch (error) {
        return false;
    }
};