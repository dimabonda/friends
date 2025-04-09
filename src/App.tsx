import { useMemo, useEffect } from 'react';
import routes from '@/routes';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import paths from '@/paths';
import { themeSettings } from "@/theme";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider, CssBaseline } from '@mui/material';
import type { RootState } from '@/state/store'
import { useSelector } from 'react-redux';
import { AuthProvider } from '@/providers/authProvider';
import { Outlet } from "react-router-dom";

// const router = createBrowserRouter([...routes]);
const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
      ),
      children: [...routes],
    },
]);


function App() {

    const mode = useSelector((state: RootState) => state.theme.mode)

    const theme = useMemo(() => {
        return createTheme(themeSettings(mode))
    }, [mode])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <RouterProvider router={router}/>
        </ThemeProvider>
    );
}

export default App;
