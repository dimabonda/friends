import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
//   import Friend from "components/Friend";
import { WidgetWrapper } from "components/WidgetWrapper";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { IPost } from "types/Post";
import type { RootState } from 'state/store'
import { useLikePostMutation } from "state/api/postApi";
import { useToast } from "hooks/useToast";
import { IComment } from "types/Comment";
import Friend from "components/Friend";
import { IAuthError } from "types/Errors";

const BASE_URL = process.env.REACT_APP_API_URL || "";

const PostWidget: FC<IPost> = ({
    id,
    title,
    user,
    image,
    likes,
    createdAt,
    comments,
}) => {
    const postImageUrl = `${BASE_URL}${image?.url}`;
	const userFullName = user.firstName + ' ' + user.lastName;
	const [likePost, {isLoading }] = useLikePostMutation();
	const { showToast } = useToast();
    const [isComments, setIsComments] = useState(false);
    const loggedInUserId = useSelector((state: RootState) => state.auth.user?.id);
	const likedIds = new Set(likes.map(like => like.id));
	
    const isLiked = loggedInUserId ? likedIds.has(loggedInUserId) : false;
    const likeCount = likes.length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
      try {
        const response = await likePost({postId: String(id)}).unwrap();
        if(response?.message){
            showToast(response.message, 'success');
        }
      } catch (err) {
		const error = err as IAuthError;
		showToast(error.data?.error?.message || 'Failed to like post', 'error');
      }
    };
  
    return (
		<WidgetWrapper m="2rem 0">
			<Friend
				friendId={user.id.toString()}
				name={userFullName}
				subtitle={user?.location || ""}
				userPhoto={user?.photo?.url || ""}
			/>
			<Typography color={main} sx={{ mt: "1rem" }}>
				{title}
			</Typography>
			{image?.url && (
				<img
					width="100%"
					height="auto"
					alt="post"
					style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
					src={postImageUrl}
				/>
			)}
			<FlexBetween mt="0.25rem">
				<FlexBetween gap="1rem">
					<FlexBetween gap="0.3rem">
						<IconButton onClick={patchLike} disabled={isLoading}>
							{isLiked ? (
								<FavoriteOutlined sx={{ color: primary }} />
							) : (
								<FavoriteBorderOutlined />
							)}
						</IconButton>
						<Typography>{likeCount}</Typography>
					</FlexBetween>
		
					<FlexBetween gap="0.3rem">
						<IconButton onClick={() => setIsComments(!isComments)}>
							<ChatBubbleOutlineOutlined />
						</IconButton>
						<Typography>{comments.length}</Typography>
					</FlexBetween>
				</FlexBetween>
	
				<IconButton>
					<ShareOutlined />
				</IconButton>
			</FlexBetween>
			{isComments && (
				<Box mt="0.5rem">
					{comments.map((comment: IComment, i) => (
						<Box key={comment.id}>
							<Divider />
							<Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
								{comment?.text || ""}
							</Typography>
						</Box>
					))}
					<Divider />
				</Box>
			)}
		</WidgetWrapper>
    );
  };
  
  export default PostWidget;