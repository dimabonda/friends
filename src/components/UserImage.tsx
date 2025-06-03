import { Box, Avatar } from "@mui/material";
import { FC } from "react";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || "";

interface IUserImageProps {
    image: string;
	size?: string;
	onClick?: () => void;
}

const UserImage: FC<IUserImageProps> = ({ image, size = "60px", onClick}) => {
	const imageUrl = `${BASE_URL}${image}`;
	return (
		<Box
			onClick={
				onClick
			}
			sx={{
				cursor: onClick ? 'pointer' : 'auto'
			}}
		>
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