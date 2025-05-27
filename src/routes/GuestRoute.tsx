import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '@/state/store';
import paths from '@/paths';

export const GuestRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (isAuthenticated === true) {
        return <Navigate to={paths.home} replace />;
    }
    return children;
};