import { FC, ReactNode, useEffect, useState } from "react";
import NavBar from "components/NavBar";
import { Navigate } from "react-router-dom";
import { checkTokenValidity } from "utils/authUtils";
import paths from "paths";
// import { UserProvider } from 'providers/userProvider';

interface LayoutProps {
    children?: ReactNode
}
const Layout: FC<LayoutProps>= ({children}) => {
    return (
        <>
            <NavBar/>
            {children}
        </>
    )
}

export default Layout;