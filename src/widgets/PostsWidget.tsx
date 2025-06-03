import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '@/state/store'
import PostWidget from "@/widgets/PostWidget";
import { useGetListQuery, useGetByUserListQuery } from "@/state/api/postApi";
import { Box, Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import FlexBetween from "@/components/FlexBetween";

interface IPostsWidget {
  	userId?: number;
}

const PostsWidget: FC<IPostsWidget> = ({ userId }) => {

	const token = useSelector((state: RootState) => state.auth.token);

	const posts = useSelector((state: RootState) => state.post.list);
	
	const [ lastPostId, setLastPostId ] = useState<number | null>(null);
	
	const handleUpdatePostList = () => {
		setLastPostId(posts.length > 0 ? posts[posts.length-1]?.id : null)
	}

	const isLastPostReallyLast =
		lastPostId !== null &&
		posts.length > 0 &&
		posts[posts.length - 1].id === lastPostId;

	const {
		data: allPostsData,
		isLoading: isAllLoading,
		isFetching,
		isError: isAllError,
		refetch
	} = 
		useGetByUserListQuery(
			{ lastPostId, pageSize: 5, userId: userId! },
			{ 
				skip: !token || (lastPostId !== null && !isLastPostReallyLast),
				refetchOnMountOrArgChange: true,
				refetchOnFocus: false,
    			refetchOnReconnect: false,
			}
		)

	useInfiniteScroll({
		callback: handleUpdatePostList,
		hasMore: !!allPostsData?.data?.hasMore,
		isFetching: isFetching,
		offset: 20,
	});

	return (
		<Box>
			{posts.map(
				({
					id,
					user,
					title,
					createdAt,
					image,
					likes,
					commentCount,
    				isFriend,
				}) => (
					<PostWidget
						key={id}
						id={id}
						createdAt={createdAt}
						image={image}
						user={user}
						title={title}
						likes={likes}
						commentCount={commentCount}
						isFriend={isFriend}
					/>
				)
			)}
			{isFetching && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
					}}
				>
					<CircularProgress/>
				</Box>
			 )}
		</Box>
	);
};

export default PostsWidget;