import { FC, useState, useCallback } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useGetUserFriendsListQuery } from "@/state/api/userApi";
import { useHasVerticalScroll } from "@/hooks/useHasVerticalScroll";
import FriendList from "@/components/FriendList";

interface IUserFriendListWidgetProps {
    userId: number;
}

const UserFriendListWidget: FC<IUserFriendListWidgetProps> = ({userId}) => {

    const token = useSelector((state: RootState) => state.auth.token);
    const [ lastCursor, setLastCursor ] = useState<number | null>(null);
	const fr = useSelector((state: RootState) => state.friend.list);

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetUserFriendsListQuery(
        { lastCursor, pageSize: 5, userId },
        { 
            skip: !token || !userId,
            refetchOnMountOrArgChange: false,
            refetchOnFocus: false,
            refetchOnReconnect: false,
        }
    );

    const friends = data?.friends ?? [];
    const hasMore = data?.hasMore ?? false;

    const { hasScroll, ref } = useHasVerticalScroll(friends.length);


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
            isCurrentUserFriendsList={false}
            hasScroll={hasScroll}
        />
    );
};

export default UserFriendListWidget;