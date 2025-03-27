import {
	ManageAccountsOutlined,
	EditOutlined,
	LocationOnOutlined,
	WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import { WidgetWrapper } from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IUser } from "types/User";

interface UserWidgetProps {
	user: IUser
}

const UserWidget: FC<UserWidgetProps> = ({ user }) => {
	const { palette } = useTheme();
	const navigate = useNavigate();
	const token = useSelector((state: any) => state.token);
	const dark = palette.neutral.dark;
	const medium = palette.neutral.medium;
	const main = palette.neutral.main;

	const {
		firstName,
		lastName,
		location,
		occupation,
		// viewedProfile,
		// impressions,
		friends,
	} = user;

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
						<Typography color={medium}>{friends?.length} {friends?.length > 1 ? "friends" : "friend"}</Typography> 
					</Box>
				</FlexBetween>
				<ManageAccountsOutlined />
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
					<img src="assets/twitter.png" alt="twitter" />
					<Box>
						<Typography color={main} fontWeight="500">
							Twitter
						</Typography>
						<Typography color={medium}>Social Network</Typography>
					</Box>
				</FlexBetween>
				<EditOutlined sx={{ color: main }} />
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
					<EditOutlined sx={{ color: main }} />
				</FlexBetween>
			</Box>
		</WidgetWrapper>
	);
};

export default UserWidget;