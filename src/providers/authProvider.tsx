import { Box } from "@mui/material";
import { useEffect } from "react";
import paths from "@/paths";
import { useNavigate, useLocation } from "react-router-dom";
import { checkTokenValidity } from "@/utils/authUtils";
import { useMeQuery } from "@/state/api/userApi";

export interface UserProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({children}: UserProviderProps): React.JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const accessToken = localStorage.getItem('accessToken');
    const isValidToken = accessToken && checkTokenValidity(accessToken);

    const { data, error, isLoading, refetch } = useMeQuery(undefined, { skip: !accessToken || !isValidToken });

    useEffect(() => {
        if (accessToken && isValidToken) {
            refetch();
        }
    }, [accessToken, isValidToken]);

    useEffect(() => {
        if (isLoading) return;
        if (!accessToken || !isValidToken || error) {
            navigate(paths.auth.login);
            return;
        }

        if (data) {
            console.log("User data fetched successfully:", data);
            navigate(paths.home);
        }
    }, [isLoading, error, data]);


    return(
        <Box>{children}</Box>
    )
}