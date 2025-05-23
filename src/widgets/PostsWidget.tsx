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
  	userId?: string;
}

const PostsWidget: FC<IPostsWidget> = ({ userId }) => {
  	const dispatch = useDispatch();
	const token = useSelector((state: RootState) => state.auth.token);

	const posts = useSelector((state: RootState) => state.post.list);
	
	const [ lastPostId, setLastPostId ] = useState<number | null>(null);

	const containerRef = useRef<HTMLDivElement | null>(null);
	// console.log("posts", posts)
	// const {
	//   data: userPosts,
	//   isLoading: isUserLoading,
	//   isError: isUserError
	// } = useGetByUserListQuery(
	//   { page, pageSize: 10, userId: userId! },
	//   { skip: !token || !userId }
	// );

	const handleUpdatePostList = () => {
		setLastPostId(posts.length > 0 ? posts[posts.length-1].id : null)
	}
	
	

	const {
		data: allPostsData,
		isLoading: isAllLoading,
		isFetching,
		isError: isAllError
	} = useGetListQuery(
		{ lastPostId, pageSize: 5 },
		{ skip: !token || !!userId }
	);

	useInfiniteScroll({
		callback: handleUpdatePostList,
		hasMore: !!allPostsData?.data?.hasMore,
		isFetching: isFetching,
		offset: 20,
	});

	const disabled = !allPostsData?.data?.hasMore;

	return (
		<Box
		// 	onScroll={(e) => {
		// 		console.log("scrolling");
		// 		const target = e.target as HTMLElement;
		// 		const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
			
		// 		if (scrollBottom < 10 && allPostsData?.data?.hasMore && !isFetching) {
		// 			handleUpdatePostList();
		// 		}
		//   }}
		  
		>
			{posts.map(
				({
					id,
					user,
					title,
					createdAt,
					image,
					likes,
					commentCount,
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