import { Box } from "@mui/material";
import { useEffect } from "react";
import paths from "@/paths";
import { useNavigate, useLocation } from "react-router-dom";
import { checkTokenValidity } from "@/utils/authUtils";
import { useMeQuery } from "@/state/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/state/slices/authSlice";

export interface UserProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({children}: UserProviderProps): React.JSX.Element => {
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem('accessToken');
    const isValidToken = accessToken && checkTokenValidity(accessToken);
    const { data, error, isLoading, refetch } = useMeQuery(undefined, { skip: !accessToken || !isValidToken });
    useEffect(() => {
        if (accessToken && isValidToken) {
            refetch();
        } else {
            dispatch(logout());
        }
    }, [accessToken, isValidToken]);

    if (isLoading) return <></>;

    return(
        <>{children}</>
    )
}