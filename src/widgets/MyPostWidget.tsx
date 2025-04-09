import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import { WidgetWrapper } from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreatePostMutation } from "state/api/postApi";
import { useToast } from "hooks/useToast";
import { IAuthError } from "types/Errors";
  
const MyPostWidget = ({ photo }: any) => {
    const [ createPost, {isLoading} ] = useCreatePostMutation();
	const { showToast } = useToast();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null as File | null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();

    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

  
    const handlePost = async () => {
      try {
        const formData = new FormData();
        formData.append("title", post);
        if (image) {
          formData.append("image", image);
        }
        const response = await createPost(formData).unwrap();
        if(response && response.message){
          showToast(response.message, 'success');
        }

        setImage(null);
        setPost("");
        setIsImage(false);
      } catch (err) {
        const error = err as IAuthError;
        showToast(error.data?.error?.message || 'Failed to create post', 'error');
      }
    };

    return (
		<WidgetWrapper>
			<FlexBetween gap="1.5rem">
				{photo && <UserImage image={photo} />}
				<InputBase
					placeholder="What's on your mind..."
					onChange={(e) => setPost(e.target.value)}
					value={post}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) { 
							handlePost();
						}
					}}
					sx={{
						width: "100%",
						backgroundColor: palette.neutral.light,
						borderRadius: "2rem",
						padding: "1rem 2rem",
					}}
				/>
			</FlexBetween>
			{isImage && (
				<Box
					border={`1px solid ${medium}`}
					borderRadius="5px"
					mt="1rem"
					p="1rem"
				>
					<Dropzone
						accept={{
							"image/jpeg": [],
							"image/png": [],
							"image/jpg": []
						}}
					multiple={false}
					onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
					>
					{({ getRootProps, getInputProps }) => (
						<FlexBetween>
						<Box
							{...getRootProps()}
							border={`2px dashed ${palette.primary.main}`}
							p="1rem"
							width="100%"
							sx={{ "&:hover": { cursor: "pointer" } }}
						>
							<input {...getInputProps()} />
							{!image ? (
							<p>Add Image Here</p>
							) : (
							<FlexBetween>
								<Typography>{image.name}</Typography>
								<EditOutlined />
							</FlexBetween>
							)}
						</Box>
						{image && (
							<IconButton
								onClick={() => setImage(null)}
								sx={{ width: "15%" }}
							>
							<DeleteOutlined />
							</IconButton>
						)}
						</FlexBetween>
					)}
					</Dropzone>
				</Box>
			)}
	
			<Divider sx={{ margin: "1.25rem 0" }} />
	
			<FlexBetween>
				<FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
					<ImageOutlined sx={{ color: mediumMain }} />
					<Typography
						color={mediumMain}
						sx={{ "&:hover": { cursor: "pointer", color: medium } }}
					>
						Image
					</Typography>
				</FlexBetween>
	
				{isNonMobileScreens ? (
					<>
						<FlexBetween gap="0.25rem">
							<GifBoxOutlined sx={{ color: mediumMain }} />
							<Typography color={mediumMain}>Clip</Typography>
						</FlexBetween>
			
						<FlexBetween gap="0.25rem">
							<AttachFileOutlined sx={{ color: mediumMain }} />
							<Typography color={mediumMain}>Attachment</Typography>
						</FlexBetween>
			
						<FlexBetween gap="0.25rem">
							<MicOutlined sx={{ color: mediumMain }} />
							<Typography color={mediumMain}>Audio</Typography>
						</FlexBetween>
					</>
				) : (
					<FlexBetween gap="0.25rem">
						<MoreHorizOutlined sx={{ color: mediumMain }} />
					</FlexBetween>
				)}
	
				<Button
					disabled={!post || isLoading}
					onClick={handlePost}
					sx={{
					color: palette.background.alt,
					backgroundColor: palette.primary.main,
					borderRadius: "3rem",
					cursor: 'pointer',
					}}
				>
					POST
				</Button>
			</FlexBetween>
		</WidgetWrapper>
    );
};
  
export default MyPostWidget;