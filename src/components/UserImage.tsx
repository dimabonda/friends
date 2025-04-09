import { Box, Avatar } from "@mui/material";
import { FC } from "react";
const BASE_URL = process.env.REACT_APP_API_URL || "";

interface IUserImageProps {
    image: string;
	size?: string;
}

const UserImage: FC<IUserImageProps> = ({ image, size = "60px" }) => {
	const imageUrl = `${BASE_URL}${image}`;
	return (
		<Box>
			<Avatar 
				sx={{
					width: size,
					height: size,
				}}
				src={imageUrl}
			/>
		</Box>
	);
};

export default UserImage;