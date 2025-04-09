import { FC, useState } from "react";
import { Box, Divider, IconButton, Button, useTheme, InputBase } from "@mui/material";
import { useCreateCommentMutation } from "@/state/api/commentApi";
import { IAuthError } from "@/types/Errors";
import { useToast } from "@/hooks/useToast";

interface ICommentInputProps{
    postId: string;
}


const CommentInput: FC<ICommentInputProps> = ({
    postId
}) => {
    const { showToast } = useToast();
    const { palette } = useTheme();
    const [value, setValue] = useState("");


    const [ createComment, { isLoading}] = useCreateCommentMutation();

    const handleSend = async () => {
        try {
            const response = await createComment({text: value, postId}).unwrap();
            if(response && response.message){
                showToast(response.message, 'success');
            }
            setValue("");
        } catch (err) {
            const error = err as IAuthError;
            showToast(error.data?.error?.message || 'Failed to create post', 'error');
        }
    }

    return (
        <Box 
            sx={{
                display: "flex",
                gap: "1rem",
            }}
        >
            <InputBase
                placeholder="Leave a comment"
                onChange={(e) => setValue(e.target.value)}
                value={value}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { 
                        handleSend();
                    }
                }}
                sx={{
                    width: "100%",
                    backgroundColor: palette.neutral.light,
                    borderRadius: "2rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.8rem",
                }}
            />
            <Button
                disabled={!value || isLoading}
                onClick={handleSend}
                sx={{
                    color: palette.background.alt,
                    backgroundColor: palette.primary.main,
                    borderRadius: "3rem",
                    cursor: 'pointer',
                }}
            >
                SEND
            </Button>
        </Box>
    )
}

export default CommentInput