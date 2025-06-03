import { FC, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Friend from "@/components/Friend";
import { WidgetWrapper } from "@/components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useGetFriendsListQuery } from "@/state/api/userApi";
import { CustomScroll } from "@/components/CustomScroll";
import { useHasVerticalScroll } from "@/hooks/useHasVerticalScroll";
import { IFriendListItem } from "@/types/Friend";
// import { setFriends } from "state";

interface IFriendListWidget {
  userId: number;
}

const FriendListWidget: FC<IFriendListWidget> = ({ userId }) => {
	const { palette } = useTheme();
	const { token, user} = useSelector((state: RootState) => state.auth);
	const friends = useSelector((state: RootState) => state.friend.list);
	// console.log('friends', friends);
	const isCurrentUserFriendsList = userId === user?.id;

	const { hasScroll, ref } = useHasVerticalScroll(friends?.length || 0);
	const [ lastCursor, setLastCursor ] = useState<number | null>(null);

	const {
		data,
		isLoading,
		isFetching,
		isError,
	} = useGetFriendsListQuery(
		{ lastCursor, pageSize: 5, userId },
		{ 
			skip: !token || !userId,
			refetchOnMountOrArgChange: true,
			refetchOnFocus: false,
    		refetchOnReconnect: false,
		}
	);

	const handleUpdateList = () => {
		setLastCursor(friends.length > 0 ? friends[friends.length-1].cursor : null)
	}

	const handleScroll = (e: Event) => {
		console.log('handleScroll', data?.hasMore);
		const target = e.target as HTMLElement;
				  
		const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

		if (scrollBottom < 5 && !isFetching && data?.hasMore) {
		  handleUpdateList();
		}
	}

	useEffect(() => {
		if (!hasScroll && data?.hasMore && !isFetching && friends.length == 4 ) {
			handleUpdateList();
		}
	}, [hasScroll, data?.hasMore, isFetching, friends.length]);

	return (
		<WidgetWrapper>
			<Typography
				color={palette.neutral.dark}
				variant="h5"
				fontWeight="500"
				sx={{ mb: "1.5rem" }}
			>
				Friend List
			</Typography>
			<CustomScroll
				maxHeight="300px"
				ref={ref}
				onScroll={handleScroll}
			>
				<Box 
					display="flex" 
					flexDirection="column" 
					gap="1.5rem"
					pr={hasScroll ? '16px' : '0px'}
				>
					
					{friends.map((friend: IFriendListItem) => (
						<Friend
							key={friend.id.toString()}
							friendId={friend.id.toString()}
							name={`${friend.firstName} ${friend.lastName}`}
							subtitle={friend.location || ''}
							userPhoto={friend?.photo?.url || ""}
							isFriend={true}
							canModifyFriendsList={isCurrentUserFriendsList}
						/>
					))}
				</Box>
			</CustomScroll>
		</WidgetWrapper>
  );
};

export default FriendListWidget;