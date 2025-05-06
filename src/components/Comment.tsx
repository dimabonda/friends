import { FC, useState } from "react";
import { Box, Divider, IconButton, Button, useTheme, InputBase, Typography } from "@mui/material";
import { IAuthError } from "@/types/Errors";
import { useToast } from "@/hooks/useToast";
import FlexBetween  from "@/components/FlexBetween";
import UserImage from "@/components/UserImage";
import { useSelector } from "react-redux"
import {
    FavoriteBorderOutlined,
    FavoriteOutlined,
} from "@mui/icons-material";
import { IComment } from "@/types/Comment";
import { timeAgo } from "@/utils/timeAgo";
import { useLikeCommentMutation } from "@/state/api/commentApi";
import type { RootState } from '@/state/store'

interface ICommentProps{
    comment: IComment;
}

export const Comment: FC<ICommentProps> = ({
    comment,
}) => {
    
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const { id, text, user, createdAt, likes } = comment;
    const fullName = user.firstName + ' ' + user.lastName;
    const url = user.photo?.url || "";

    const { showToast } = useToast();

    const loggedInUserId = useSelector((state: RootState) => state.auth.user?.id);
    const likesCount = likes?.length || 0;
    const likeIds = new Set(likes?.map((like) => like.id));
    const isLiked = likeIds.has(Number(loggedInUserId));

    const [ likeComment, {isLoading }] = useLikeCommentMutation();
    
    const handleLikePost = async () => {
        try {
            const response = await likeComment({commentId: String(id)}).unwrap();
            if(response?.message){
                showToast(response.message, 'success');
            }
        } catch (err) {
            const error = err as IAuthError;
            showToast(error.data?.error?.message || 'Failed to like comment', 'error');
        }
    };

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
                            {text || ""}
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
                            onClick={handleLikePost}
                        >
							{isLiked ? (
								<FavoriteOutlined sx={{ color: primary }} />
							) : (
								<FavoriteBorderOutlined />
							)}
						</IconButton>
						<Typography>{likesCount}</Typography>
					</FlexBetween>
                </Box>
            </Box>
        </Box>
        
    )
}