import { FC, useState, useCallback, memo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Friend from "@/components/Friend";
import { WidgetWrapper } from "@/components/WidgetWrapper";
import { CustomScroll } from "@/components/CustomScroll";
import { IFriendListItem } from "@/types/Friend";

interface IFriendListProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  handleScroll: (e: Event) => void;
  friends: IFriendListItem[];
  isCurrentUserFriendsList: boolean;
  hasScroll?: boolean;
}

const FriendList: FC<IFriendListProps> = memo(({
	scrollRef,
	handleScroll,
	friends,
	isCurrentUserFriendsList,
	hasScroll = false,
}) => {
	const { palette } = useTheme();

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
				ref={scrollRef}
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
	)
})

export default FriendList;