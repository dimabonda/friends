import { RouteObject, Outlet, Navigate } from 'react-router-dom';
import paths from 'paths';
import Login from 'pages/login';
import Register from 'pages/register';
import Profile from 'pages/profile';
import Home from 'pages/home';
import NotFound from 'pages/404';
import ProfileDetails from 'pages/profile/details';
import Layout from 'pages/layout';
import { checkTokenValidity } from 'utils/authUtils';
import { ProtectedRoute } from './ProtectedRoute';


const routes: RouteObject[] = [
    {
        path: paths.auth.login,
        element: <Login/>
    },
    {
        path: paths.auth.register,
        element: <Register/>
    },
    {
        path: paths.home, 
        element: (
            // <ProtectedRoute>
                <Layout>
                    <Outlet/>
                </Layout>
            // </ProtectedRoute>
        ),
        children: [
            {
                index: true, //default path, or paths.home
                element: <Home/>
            },
            {
                path: paths.profile.index,
                element: <Profile/>
            },
            {
                path: paths.profile.details,
                element: <ProfileDetails/>
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    },
]

export default routes;