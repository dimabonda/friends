import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Divider, IconButton, Typography, useTheme, InputBase } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import { WidgetWrapper } from "@/components/WidgetWrapper";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { IPost } from "@/types/Post";
import type { RootState } from '@/state/store'
import { useLikePostMutation } from "@/state/api/postApi";
import { useToast } from "@/hooks/useToast";
import { IComment } from "@/types/Comment";
import Friend from "@/components/Friend";
import CommentInput from "@/components/CommentInput";
import { IAuthError } from "@/types/Errors";
import { useGetListQuery } from "@/state/api/commentApi";
import UserImage from "@/components/UserImage";
import { Comment } from "@/components/Comment";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { CustomScroll } from "@/components/CustomScroll";
import { useHasVerticalScroll } from "@/hooks/useHasVerticalScroll";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDeletePostMutation } from "@/state/api/postApi";

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || "";

const PostWidget: FC<IPost> = ({
    id,
    title,
    user,
    image,
    likes,
    createdAt,
    commentCount,
	isFriend,
}) => {
	
	const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

	const token = useSelector((state: RootState) => state.auth.token);

    const postImageUrl = `${BASE_URL}${image?.url}`;
	const userFullName = user.firstName + ' ' + user.lastName;
	const loggedInUserId = useSelector((state: RootState) => state.auth.user?.id);
	const [ likePost, {isLoading }] = useLikePostMutation();
	const [ lastCommentId, setLastCommentId ] = useState<number | null | undefined>(undefined);

	const { 
		isError,
		isLoading: isLoadingGetList,
		isFetching,
		data,
	} = useGetListQuery(
		{ lastCommentId, postId: String(id), pageSize: 5},
		{ skip: !token || lastCommentId === undefined}
	)

	const isShowDeleteButton = loggedInUserId === user.id;
	const [ deletePost, { isLoading: isDeleteLoading }] = useDeletePostMutation();

	const handleDeletePost = async () => {
		try {
			const response = await deletePost({postId: String(id)}).unwrap();
            if(response?.message){
                showToast(response.message, 'success');
            }
		} catch (error) {
			const err = error as IAuthError;
			showToast(err.data?.error?.message || 'Failed to delete post', 'error');
		}
	}

	const { showToast } = useToast();
    const [isComments, setIsComments] = useState(false);
    

	const likedIds = new Set(likes.map(like => like.id));
	
    const isLiked = loggedInUserId ? likedIds.has(loggedInUserId) : false;
    const likeCount = likes.length;

	const comments = useSelector((state: RootState) => state.comment.list[id] || null)
	const { hasScroll, ref } = useHasVerticalScroll(comments?.length || 0);

	const handleCommentClick = () => {
		if (commentCount && !comments){
			handleUpdateCommentList();
		}
		setIsComments(!isComments);
	}

	const handleUpdateCommentList = () => {
		setLastCommentId(comments && comments.length > 0 ? comments[comments.length - 1]?.id : null)
	}

	const handleScroll = (e: Event) => {
		const target = e.target as HTMLElement;
				  
		const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

		if (scrollBottom < 5 && !isFetching && data?.data?.hasMore) {
		  handleUpdateCommentList();
		}
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


	const disabledCommentButton = !commentCount ? true : false;

    return (
		<WidgetWrapper m="0 0 2rem">
			<Friend
				friendId={user.id.toString()}
				name={userFullName}
				subtitle={user?.location || ""}
				userPhoto={user?.photo?.url || ""}
				isFriend={isFriend}
				canModifyFriendsList={true}
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
								() => { handleCommentClick()}
							}
							disabled={disabledCommentButton}
						>
							<ChatBubbleOutlineOutlined />
						</IconButton>
						<Typography>{commentCount || 0}</Typography>
					</FlexBetween>
				</FlexBetween>
	
				{isShowDeleteButton && <IconButton
					onClick={handleDeletePost}
					disabled={isDeleteLoading}
				>
					<DeleteOutlineIcon/>
				</IconButton>}
			</FlexBetween>
			{isComments && (
				 <CustomScroll
					maxHeight="250px"
					ref={ref}
					onScroll={handleScroll}
				>
					<Box
						mt="0.5rem"
						pr={hasScroll ? '16px' : '0px'}
					>
						{comments && comments.length > 0 && comments.map((comment: IComment, i) => (
							<Box key={comment.id}>
								<Divider />
								<Comment
									comment={comment}
								/>
							</Box>
						))}
						{isFetching && (
							<Box display="flex" justifyContent="center" py="1rem">
								<CircularProgress size={20} />
							</Box>
						)}
					</Box>
				</CustomScroll>
			)} 
			<Divider sx={{ margin: "1.25rem 0" }} />
			<CommentInput postId={String(id)}/>
		</WidgetWrapper>
    );
  };
  
  export default PostWidget;