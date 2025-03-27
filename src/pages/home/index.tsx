import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import MyPostWidget from "widgets/MyPostWidget";
import UserWidget from "widgets/UserWidget";
// import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "widgets/PostsWidget";
import { useEffect } from "react";
import type { RootState } from 'state/store'
// import AdvertWidget from "scenes/widgets/AdvertWidget";
// import FriendListWidget from "scenes/widgets/FriendListWidget";


const Home = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <Box>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : ""}>
                    {user && <UserWidget user={user} />}
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : ""}
                    mt={isNonMobileScreens ? "" : "2rem"}
                >
                    <MyPostWidget photo={user?.photo?.url || ""} />
                    <PostsWidget />
                </Box>
                {isNonMobileScreens && (
                    <Box flexBasis="26%">
                        {/* <AdvertWidget />
                        <Box m="2rem 0" />
                        <FriendListWidget userId={_id} /> */}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default Home;