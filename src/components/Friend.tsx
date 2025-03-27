import { FC } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import type { RootState } from 'state/store'
import { useFollowMutation } from "state/api/userApi";
import { useToast } from "hooks/useToast";
import { IAuthError } from "types/Errors";

interface IFriend {
	id: number;
	username: string;
}

interface IFriendProps {
	friendId: string;
	name: string;
	subtitle: string;
	userPhoto: string;
}

const Friend: FC<IFriendProps> = ({ friendId, name, subtitle, userPhoto }) => {
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.auth.user);
	const friendIds = new Set(user?.friends?.map((friend: IFriend ) => friend.id))
	const isCurrentUser = friendId === user?.id?.toString();
	const isFriend = friendId ? friendIds.has(Number(friendId)) : false;

	const { palette } = useTheme();
	const [ follow, { isLoading} ] = useFollowMutation()
	const { showToast } = useToast();
	const primaryLight = palette.primary.light;
	const primaryDark = palette.primary.dark;
	const main = palette.neutral.main;
	const medium = palette.neutral.medium;

	const patchFriend = async () => {
		try {
			const response = await follow({userId: friendId}).unwrap();
			if(response?.message){
				showToast(response.message, 'success');
			}
		} catch (err) {
			const error = err as IAuthError;
			showToast(error.data?.error?.message || 'Failed to follow user', 'error');
		}
	};

	return (
		<FlexBetween>
			<FlexBetween gap="1rem">
				<UserImage image={userPhoto} size="55px" />
				<Box
					onClick={() => {
						navigate(`/profile/${friendId}`);
						navigate(0);
					}}
				>
					<Typography
						color={main}
						variant="h5"
						fontWeight="500"
						sx={{
							"&:hover": {
								color: palette.primary.light,
								cursor: "pointer",
							},
						}}
					>
						{name}
					</Typography>
					<Typography color={medium} fontSize="0.75rem">
						{subtitle}
					</Typography>
				</Box>
			</FlexBetween>
			{!isCurrentUser && 
				<IconButton
					disabled={isLoading}
					onClick={() => patchFriend()}
					sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
				>
					{isFriend ? (
						<PersonRemoveOutlined sx={{ color: primaryDark }} />
					) : (
						<PersonAddOutlined sx={{ color: primaryDark }} />
					)}
				</IconButton>
		 	}
		</FlexBetween>
	);
};

export default Friend;