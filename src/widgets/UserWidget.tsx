import {
	ManageAccountsOutlined,
	EditOutlined,
	LocationOnOutlined,
	WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "@/components/UserImage";
import FlexBetween from "@/components/FlexBetween";
import { WidgetWrapper } from "@/components/WidgetWrapper";
import { useSelector } from "react-redux";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IUser } from "@/types/User";
import { RootState } from "@/state/store";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { useFollowMutation } from "@/state/api/userApi";
import { IAuthError } from "@/types/Errors";
import { useToast } from "@/hooks/useToast";

interface UserWidgetProps {
	user: IUser
}

const UserWidget: FC<UserWidgetProps> = ({ user }) => {
	const { palette } = useTheme();
	const navigate = useNavigate();
	const { token, user: me} = useSelector((state: RootState) => state.auth);
	const dark = palette.neutral.dark;
	const medium = palette.neutral.medium;
	const main = palette.neutral.main;
	const primaryLight = palette.primary.light;
	const primaryDark = palette.primary.dark;
	const { showToast } = useToast();
	const [ follow, { isLoading} ] = useFollowMutation();

	const {
		id,
		firstName,
		lastName,
		location,
		occupation,
		// viewedProfile,
		// impressions,
		friendsCount,
		isFriend
	} = user;

	const isCurrentUser = me?.id === id;

	const patchFriend = async () => {
		if (isCurrentUser) return;
		try {
			const response = await follow({userId: id.toString()}).unwrap();
			if(response?.message){
				showToast(response.message, 'success');
			}
		} catch (err) {
			const error = err as IAuthError;
			showToast(error.data?.error?.message || 'Failed to follow user', 'error');
		}
	};

	const handleOpenProfile = () => {
		// navigate(`/profile/${user._id}`);
		console.log('Open Profile');
	}

	return (
		<WidgetWrapper>
			{/* FIRST ROW */}
			<FlexBetween
				gap="0.5rem"
				pb="1.1rem"
				onClick={handleOpenProfile}
				sx={{cursor: "pointer"}}
			>
				<FlexBetween gap="1rem">
					{user?.photo && <UserImage image={user?.photo?.url || ""} />}
					<Box>
						<Typography
							variant="h4"
							color={dark}
							fontWeight="500"
							sx={{
								"&:hover": {
								color: palette.primary.light,
								cursor: "pointer",
								},
							}}
						>
							{firstName} {lastName}
						</Typography>
						<Typography color={medium}>{friendsCount || 0} {friendsCount > 1 ? "friends" : "friend"}</Typography> 
					</Box>
				</FlexBetween>
				{isCurrentUser ? 
			        <IconButton 
						sx={{
							padding: 0,
							
						}}
						onClick={() => navigate('/settings')}
					>
						<ManageAccountsOutlined />
					</IconButton>
					:
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

			<Divider />

			{/* SECOND ROW */}
			<Box p="1rem 0">
				{location && <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
					<LocationOnOutlined fontSize="large" sx={{ color: main }} />
					<Typography color={medium}>{location}</Typography>
				</Box>}
				{occupation && <Box display="flex" alignItems="center" gap="1rem">
					<WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
					<Typography color={medium}>{occupation}</Typography>
				</Box>}
			</Box>

			{(location || occupation) && <Divider />}

			{/* THIRD ROW */}
			<Box p="1rem 0">
				<FlexBetween mb="0.5rem">
					<Typography color={medium}>Who's viewed your profile</Typography>
					<Typography color={main} fontWeight="500">
						{20}
					</Typography>
				</FlexBetween>
				<FlexBetween>
					<Typography color={medium}>Impressions of your post</Typography>
					<Typography color={main} fontWeight="500">
						{20}
					</Typography>
				</FlexBetween>
			</Box>

			<Divider />

			{/* FOURTH ROW */}
			<Box p="1rem 0">
				<Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
					Social Profiles
				</Typography>

				<FlexBetween gap="1rem" mb="0.5rem">
				<FlexBetween gap="1rem">
					<img src="/assets/twitter.png" alt="twitter" />
					<Box>
						<Typography color={main} fontWeight="500">
							Twitter
						</Typography>
						<Typography color={medium}>Social Network</Typography>
					</Box>
				</FlexBetween>
				{isCurrentUser && <EditOutlined sx={{ color: main }} />}
				</FlexBetween>

				<FlexBetween gap="1rem">
					<FlexBetween gap="1rem">
						<img src="/assets/linkedin.png" alt="linkedin" />
						<Box>
							<Typography color={main} fontWeight="500">
								Linkedin
							</Typography>
							<Typography color={medium}>Network Platform</Typography>
						</Box>
					</FlexBetween>
					{isCurrentUser && <EditOutlined sx={{ color: main }} />}
				</FlexBetween>
			</Box>
		</WidgetWrapper>
	);
};

export default UserWidget;