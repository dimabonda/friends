

import { FC, useState } from "react";
import { 
    Box, 
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme, 
    useMediaQuery,
} from "@mui/material";

import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close,
} from "@mui/icons-material"

import FlexBetween from "components/FlexBetween";

import type { RootState } from 'state/store'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toggleMode } from "state/slices/themeSlice";
import { logout } from "state/slices/authSlice";
import paths from "paths";

interface NavBarProps {

}
const NavBar:FC<NavBarProps> = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isNotMobileScreen = useMediaQuery("(min-width: 1000px)");
    const fullName = `user user`;

    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        dispatch(logout());
        navigate(paths.auth.login);
    };

    const handleToggleMode = () => {
        const newMode = theme.palette.mode === "dark" ? "light" : "dark";
        localStorage.setItem("friends-theme", newMode);
        dispatch(toggleMode());
    }

    return (
        <FlexBetween padding="1rem 6%" sx={{ backgroundColor: alt }}>
            <FlexBetween gap="1.75rem">
                <Typography
                    fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)"
                    color="primary"
                    onClick={() => navigate("/")}
                    sx={{
                        "&:hover": {
                        color: primaryLight,
                        cursor: "pointer",
                        },
                    }}
                >
                    Friends
                </Typography>
                {isNotMobileScreen && (
                    <FlexBetween
                        sx={{
                            backgroundColor: neutralLight
                        }}
                        borderRadius="9px"
                        gap="3rem"
                        padding="0.1rem 1.5rem"
                    >
                        <InputBase placeholder="Search..." />
                        <IconButton>
                            <Search />
                        </IconButton>
                    </FlexBetween>
                )}
            </FlexBetween>

            {/* DESKTOP NAV */}
            {isNotMobileScreen ? (
                <FlexBetween gap="2rem">
                    <IconButton onClick={handleToggleMode}>
                        {theme.palette.mode === "dark" ? (
                            <DarkMode sx={{fontSize: "25px"}}/>
                        ) : (
                            <LightMode sx={{color: "dark", fontSize: "25px"}}/>
                        )}
                    </IconButton>
                    <Message sx={{ fontSize: "25px" }} />
                    <Notifications sx={{ fontSize: "25px" }} />
                    <Help sx={{ fontSize: "25px" }} />
                    <FormControl variant="standard">
                        <Select
                            value={fullName}
                            sx={{
                                backgroundColor: neutralLight,
                                width: "150px",
                                borderRadius: "0.25rem",
                                p: "0.25rem 1rem",
                                "& .MuiSvgIcon-root": {
                                pr: "0.25rem",
                                width: "3rem",
                                },
                                "& .MuiSelect-select:focus": {
                                backgroundColor: neutralLight,
                                },
                            }}
                            input={<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography>
                            </MenuItem>
                            <MenuItem 
                                onClick={handleLogout}
                            >Log Out</MenuItem>
                        </Select>
                    </FormControl>
                </FlexBetween>
            ) : (
                <IconButton
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <Menu />
                </IconButton>
            )}


            {/* MOBILE NAV */}
            {!isNotMobileScreen && isMobileMenuToggled && (
                <Box
                    position="fixed"
                    right="0"
                    bottom="0"
                    height="100%"
                    zIndex="10"
                    maxWidth="500px"
                    minWidth="300px"
                    width="100%"
                    sx={{
                        backgroundColor: background
                    }}
                >
                    {/* CLOSE ICON */}
                    <Box display="flex" justifyContent="flex-end" p="1rem">
                        <IconButton
                            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    {/* MENU ITEMS */}
                    <FlexBetween
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        gap="3rem"
                    >
                        <IconButton
                            onClick={() => dispatch(toggleMode())}
                            sx={{ fontSize: "25px" }}
                        >
                            {theme.palette.mode === "dark" ? (
                                <DarkMode sx={{ fontSize: "25px" }} />
                            ) : (
                                <LightMode sx={{ color: dark, fontSize: "25px" }} />
                            )}
                        </IconButton>
                        <Message sx={{ fontSize: "25px" }} />
                        <Notifications sx={{ fontSize: "25px" }} />
                        <Help sx={{ fontSize: "25px" }} />
                        <FormControl variant="standard">
                            <Select
                                value={fullName}
                                sx={{
                                backgroundColor: neutralLight,
                                width: "150px",
                                borderRadius: "0.25rem",
                                p: "0.25rem 1rem",
                                "& .MuiSvgIcon-root": {
                                    pr: "0.25rem",
                                    width: "3rem",
                                },
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: neutralLight,
                                },
                                }}
                                input={<InputBase />}
                            >
                                <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => console.log("Log Out")}>
                                    Log Out
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </FlexBetween>
                </Box>
            )}
        </FlexBetween>
    )
}

export default NavBar;