import { FC, useState, useCallback, memo } from "react";
import { useTheme } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useGetFriendsListQuery } from "@/state/api/userApi";
import { useHasVerticalScroll } from "@/hooks/useHasVerticalScroll";
import FriendList from "@/components/FriendList";
import { skipToken } from "@reduxjs/toolkit/query";

interface IMyFriendListWidgetProps {

}

const MyFriendListWidget: FC<IMyFriendListWidgetProps> = () => {

	const { palette } = useTheme();
	const token = useSelector((state: RootState) => state.auth.token);
	const user = useSelector((state: RootState) => state.auth.user);

	const friends = useSelector((state: RootState) => state.friend.list);
	const hasMore = useSelector((state: RootState) => state.friend.hasMore);

	const { hasScroll, ref } = useHasVerticalScroll(friends?.length || 0);
	const [ lastCursor, setLastCursor ] = useState<number | null>(null);

	const queryArgs = user?.id ? { lastCursor, pageSize: 5, userId: user.id } : skipToken;

	const {
		data,
		isLoading,
		isFetching,
		isError,
	} = useGetFriendsListQuery(
		queryArgs,
		{ 
			skip: !token || !user?.id,
			refetchOnMountOrArgChange: false,
			refetchOnFocus: false,
    		refetchOnReconnect: false,
		}
	);

	const handleUpdateList = useCallback(() => {
		const newCursor = friends.length > 0 ? friends[friends.length-1].cursor : null;
		if (lastCursor !== newCursor) {
			setLastCursor(newCursor);
		}
	}, [friends, lastCursor]);

	const handleScroll = useCallback((e: Event) => {
		const target = e.target as HTMLElement;
				  
		const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

		if (scrollBottom < 5 && !isFetching && hasMore) {
		  	handleUpdateList();
		}
	},  [handleUpdateList, isFetching, hasMore]);

	useEffect(() => {
		if (!hasScroll && hasMore && !isFetching && friends.length == 4 ) {
			handleUpdateList();
		}
	}, [hasScroll, hasMore, isFetching, friends.length]);

	return (
		<FriendList
			scrollRef={ref}
			handleScroll={handleScroll}
			friends={friends}
			isCurrentUserFriendsList={true}
			hasScroll={hasScroll}
		/>
	);
};

export default MyFriendListWidget;