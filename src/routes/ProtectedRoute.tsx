import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import type { RootState } from 'state/store'
import paths from 'paths';

interface UserProviderProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: UserProviderProps) => {
    // const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
    // при перезагрузке станицы появляется логин пейдж это иза этого протектед 
    // console.log("ProtectedRoute", token)
    // if (!token || !isAuthenticated) {
        
    //     return <Navigate to="/login" />;
    // }

    return children;
};