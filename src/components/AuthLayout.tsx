import { FC, ReactNode } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

interface AuthLayoutProps {
    children?: ReactNode
    title?: string
}

export const AuthLayout: FC<AuthLayoutProps> = ({
    children, 
    title = 'Welcome to Friends — the social network that brings people closer!'
}) => {
    const theme = useTheme();
    const isNotMobileScreen = useMediaQuery("(min-width: 1000px)");
    return(
        <Box>
            <Box
                width="100%"
                p="1rem 6%"
                textAlign="center"
                sx={{
                    backgroundColor: theme.palette.background.alt
                }}
            >
                <Typography fontWeight="bold" fontSize="32px" color="primary">
                    Friends
                </Typography>
            </Box>

            <Box
                width={isNotMobileScreen ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                sx={{
                    backgroundColor: theme.palette.background.alt
                }}
            >
                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                    {title}
                </Typography>
                {children}
        </Box>
    </Box>
    )
}