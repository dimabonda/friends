import { FC } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "@/components/FlexBetween";
import UserImage from "@/components/UserImage";
import type { RootState } from '@/state/store'
import { useFollowMutation } from "@/state/api/userApi";
import { useToast } from "@/hooks/useToast";
import { IAuthError } from "@/types/Errors";

interface IFriend {
	id: number;
	username: string;
}

interface IFriendProps {
	friendId: string;
	name: string;
	subtitle: string;
	userPhoto: string;
	isFriend: boolean;
	canModifyFriendsList: boolean;
}

const Friend: FC<IFriendProps> = ({ friendId, name, subtitle, userPhoto, isFriend, canModifyFriendsList }) => {
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.auth.user);
	const isCurrentUser = friendId === user?.id?.toString();

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
				<UserImage 
					image={userPhoto} 
					size="55px"
					onClick={() => {
						navigate(`/profile/${friendId}`);
						// navigate(0);
					}}
				/>
				<Box
					onClick={() => {
						navigate(`/profile/${friendId}`);
						// navigate(0);
					}}
					sx={{
						cursor: "pointer",
					}}
				>
					<Typography
						color={main}
						variant="h5"
						fontWeight="500"
						sx={{
							"&:hover": {
								color: palette.primary.light,
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
			{canModifyFriendsList && (!isCurrentUser && 
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
				</IconButton>)
		 	}
		</FlexBetween>
	);
};

export default Friend;