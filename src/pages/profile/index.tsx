import { FC } from "react";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "@/state/store";
import UserWidget from "@/widgets/UserWidget";
import PostsWidget from "@/widgets/PostsWidget";
import { useGetUserProfileQuery } from "@/state/api/userApi";
import FriendListWidget from "@/widgets/FriendListWidget";


const Profile:FC = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    const { id } = useParams();

    if (!id) {
        return null;
    }

    const {
        data,
        isLoading,
        isFetching,
    } = useGetUserProfileQuery(
        { userId: id },
        { skip: !id }
    )

    const user = data?.user;

    if (!user?.id) {
        return null;
    }

    return (
        <Box>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="2rem"
                justifyContent="center"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : ""}>
                    {user && <UserWidget user={user} />}
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : ""}
                    mt={isNonMobileScreens ? "" : "2rem"}
                >
                    <PostsWidget userId={user?.id}/>
                </Box>
                {isNonMobileScreens && (
                    user && <Box flexBasis="26%">
                        <FriendListWidget userId={user?.id} />
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default Profile;