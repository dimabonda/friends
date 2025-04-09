import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '@/state/store'
import PostWidget from "@/widgets/PostWidget";
import { useGetListQuery, useGetByUserListQuery } from "@/state/api/postApi";
import { Button } from "@mui/material";

interface IPostsWidget {
  	userId?: string;
}

const PostsWidget: FC<IPostsWidget> = ({ userId }) => {
  	const dispatch = useDispatch();
	const token = useSelector((state: RootState) => state.auth.token);

	const posts = useSelector((state: RootState) => state.post.list);
	
	const [ lastPostId, setLastPostId ] = useState<number | null>(null);
	console.log("posts", posts)
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
		isError: isAllError
	} = useGetListQuery(
		{ lastPostId, pageSize: 5 },
		{ skip: !token || !!userId }
	);

	const disabled = !allPostsData?.data?.hasMore;

	return (
		<>
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
			
			<Button
				onClick={handleUpdatePostList}
				disabled={disabled}
			>
				Load More
			</Button>
		</>
	);
};

export default PostsWidget;