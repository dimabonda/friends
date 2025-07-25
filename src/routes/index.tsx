import { RouteObject, Outlet, Navigate } from 'react-router-dom';
import paths from '@/paths';
import Login from '@/pages/login';
import Register from '@/pages/register';
import VerifyCode from '@/pages/verify-code';
import Profile from '@/pages/profile';
import Home from '@/pages/home';
import NotFound from '@/pages/404';
import ProfileDetails from '@/pages/profile/details';
import Layout from '@/pages/layout';
import { checkTokenValidity } from '@/utils/authUtils';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { GuestRoute } from '@/routes/GuestRoute'


const routes: RouteObject[] = [
    {
        path: paths.auth.login,
        element: (
            <GuestRoute>
                <Login/>
            </GuestRoute>
        )
    },
    {
        path: paths.auth.register,
        element: (
            <GuestRoute>
               <Register/>
            </GuestRoute>
        )
    },
    {
        path: paths.auth.confirmRegister,
        element: (
            <GuestRoute>
               <VerifyCode/>
            </GuestRoute>
        )
    },
    {
        path: paths.home, 
        element: (
            <ProtectedRoute>
                <Layout>
                    <Outlet/>
                </Layout>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true, //default path, or paths.home
                element: <Home/>
            },
            {
                path: paths.profile.details,
                element: <Profile/>
            },
            // {
            //     path: paths.profile.details,
            //     element: <ProfileDetails/>
            // },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    },
]

export default routes;