import { Box } from "@mui/material";
import { styled } from "@mui/material";

export const WidgetWrapper = styled(Box)(({
    theme
}) => ({
    padding: "1.5rem 1.5rem 1rem 1.5rem",
    backgroundColor: theme.palette.background.alt,
    borderRadius: "0.75rem",
}))