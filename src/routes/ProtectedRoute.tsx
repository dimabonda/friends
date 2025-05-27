import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '@/state/store'
import paths from '@/paths';

interface UserProviderProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: UserProviderProps) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (isAuthenticated === false) {
        return <Navigate to="/login" />;
    }

    return children;
};