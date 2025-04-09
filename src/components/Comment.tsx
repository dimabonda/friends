import { FC, useState } from "react";
import { Box, Divider, IconButton, Button, useTheme, InputBase, Typography } from "@mui/material";
import { useCreateCommentMutation } from "@/state/api/commentApi";
import { IAuthError } from "@/types/Errors";
import { useToast } from "@/hooks/useToast";
import FlexBetween  from "@/components/FlexBetween";
import UserImage from "@/components/UserImage";
import {
    FavoriteBorderOutlined,
    FavoriteOutlined,
} from "@mui/icons-material";

interface ICommentProps{
    url: string;
    comment: string;
    fullName: string;
    createdAt: string;
}
// function pluralize(value: number, unit: string): string {
// 	return `${value} ${unit}${value !== 1 ? 's' : ''} ago`;
// }

function timeAgo(isoDate: string): string {
	const now = new Date();
	const past = new Date(isoDate);
	const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

	if (seconds < 60) return `${seconds} sec ago`;

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} min ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} h ago`;

	const days = Math.floor(hours / 24);
	if (days < 7) return `${days} d ago`;

	const weeks = Math.floor(days / 7);
	if (weeks < 4) return `${weeks} w ago`;

	const months = Math.floor(days / 30);
	if (months < 12) return `${months} m ago`;

	const years = Math.floor(days / 365);
	return `${years} y ago`;
}


export const Comment: FC<ICommentProps> = ({
    url,
    fullName,
    comment,
    createdAt,
}) => {

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
 
    return (
        <Box sx={{
            py: "0.5rem",
        }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <UserImage image={url} size="35px" />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            pl: "1rem",
                        }}
                    >
                        <Typography
                            color={main}
                            variant="h6"
                            fontWeight="500"
                            fontSize={12}
                            sx={{
                                "&:hover": {
                                    color: palette.primary.light,
                                    cursor: "pointer",
                                },
                            }}
                        >
                            {fullName || ""}
                        </Typography>
                        <Typography 
                            fontSize={12}
                            sx={{ 
                                color: main, 
                            }}
                        >
                            {comment || ""}
                        </Typography>
                    </Box>
                    
                </Box>
                <Box 
                    sx={{
                        minWidth: '5rem',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}
                >
                    <Typography
                        color={main}
                        variant="h6"
                        fontWeight="500"
                        fontSize={12}
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer",
                            },
                        }}
                    >
                        {timeAgo(createdAt)}
                    </Typography>
                    <FlexBetween gap="0.3rem" justifyContent={"flex-end !important"}>
						<IconButton 
                            sx={{
                                py: "0rem",
                            }}
                        >
							{false ? (
								<FavoriteOutlined sx={{ color: primary }} />
							) : (
								<FavoriteBorderOutlined />
							)}
						</IconButton>
						<Typography>{3}</Typography>
					</FlexBetween>
                </Box>
            </Box>
        </Box>
        
    )
}