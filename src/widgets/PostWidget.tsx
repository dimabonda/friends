import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, InputBase } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { WidgetWrapper } from "components/WidgetWrapper";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { IPost } from "types/Post";
import type { RootState } from 'state/store'
import { useLikePostMutation } from "state/api/postApi";
import { useToast } from "hooks/useToast";
import { IComment } from "types/Comment";
import Friend from "components/Friend";
import CommentInput from "components/CommentInput";
import { IAuthError } from "types/Errors";
import { useGetListQuery } from "state/api/commentApi";
import UserImage from "components/UserImage";
import { Comment } from "components/Comment";

const BASE_URL = process.env.REACT_APP_API_URL || "";

const PostWidget: FC<IPost> = ({
    id,
    title,
    user,
    image,
    likes,
    createdAt,
    commentCount,
}) => {

	const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

	const token = useSelector((state: RootState) => state.auth.token);

    const postImageUrl = `${BASE_URL}${image?.url}`;
	const userFullName = user.firstName + ' ' + user.lastName;

	const [likePost, {isLoading }] = useLikePostMutation();
	const [ lastCommentId, setLastCommentId ] = useState<number | null | undefined>(undefined);

	const { 
		isError,
		isLoading: isLoadingGetList,
		data,
	} = useGetListQuery(
		{ lastCommentId, postId: String(id), pageSize: 5},
		{ skip: !token || lastCommentId === undefined}
	)

	const { showToast } = useToast();
    const [isComments, setIsComments] = useState(false);
    const loggedInUserId = useSelector((state: RootState) => state.auth.user?.id);

	const likedIds = new Set(likes.map(like => like.id));
	
    const isLiked = loggedInUserId ? likedIds.has(loggedInUserId) : false;
    const likeCount = likes.length;

	const comments = useSelector((state: RootState) => state.comment.list[id] || null)

	
	const handleUpdateCommentList = () => {
		setLastCommentId(comments && comments.length > 0 ? comments[comments.length - 1]?.id : null)
	}


  
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

	const disabledCommentButton = data ? !data?.data?.hasMore : false;
  
    return (
		<WidgetWrapper m="2rem 0">
			<Friend
				friendId={user.id.toString()}
				name={userFullName}
				subtitle={user?.location || ""}
				userPhoto={user?.photo?.url || ""}
			/>
			{image?.url && (
				<img
					width="100%"
					height="auto"
					alt="post"
					style={{ borderRadius: "0.75rem", marginTop: "1rem" }}
					src={postImageUrl}
				/>
			)}
			<Typography color={main} sx={{ mt: "0.75rem" }}>
				{title}
			</Typography>
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
						<IconButton 
							onClick={
								handleUpdateCommentList
							}
							disabled={disabledCommentButton}
						>
							<ChatBubbleOutlineOutlined />
						</IconButton>
						<Typography>{commentCount || 0}</Typography>
					</FlexBetween>
				</FlexBetween>
	
				<IconButton>
					<ShareOutlined />
				</IconButton>
			</FlexBetween>
			{comments && comments.length > 0 && (
				<Box mt="0.5rem">
					{comments.map((comment: IComment, i) => (
						<Box key={comment.id}>
							<Divider />
							<Comment
								url={comment.user.photo?.url || ""}
								comment={comment.text}
								fullName={`${comment.user.firstName} ${comment.user.lastName}`}
								createdAt={comment.createdAt}
							/>
						</Box>
					))}
				</Box>
			)} 
			<Divider sx={{ margin: "1.25rem 0" }} />
			<CommentInput postId={String(id)}/>
		</WidgetWrapper>
    );
  };
  
  export default PostWidget;