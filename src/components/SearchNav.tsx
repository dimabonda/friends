import { FC, useEffect, useState } from "react";
import { 
    Box, 
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme, 
    useMediaQuery,
} from "@mui/material";
import { WidgetWrapper } from "@/components/WidgetWrapper";
import {
    Search,
} from "@mui/icons-material";
import FlexBetween from "@/components/FlexBetween";
import { CustomScroll } from "@/components/CustomScroll";
import { useHasVerticalScroll } from "@/hooks/useHasVerticalScroll";
import { IFriendListItem } from "@/types/Friend";
import { useGetUserListQuery } from "@/state/api/userApi";
import { useDebounce } from "@/hooks/useDebounce";
import { IUserListItem } from "@/types/User";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import Friend from "@/components/Friend";
import { overwriteUsers } from "@/state/slices/userSlice";

export const SearchNav = () => {
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [lastCursor, setLastCursor] = useState<number | null>(null);

    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);

    const {list: users, count} = useSelector((state: RootState) => state.users);

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetUserListQuery({
        pageSize: 5,
        lastCursor,
        query: debouncedQuery,
    },{
        skip: !debouncedQuery,
        refetchOnMountOrArgChange: true,
    })

    useEffect(()=> {
        if (debouncedQuery === ""){
            dispatch(overwriteUsers({users: [], count: 0}));
        }

    }, [debouncedQuery])

    console.log("users", users);

    const { hasScroll, ref } = useHasVerticalScroll(users?.length || 0);

    const handleScroll = () => {
        // Handle scroll logic here if needed
        console.log('Scroll event triggered');
    }

    return (
        <Box 
            sx={{
                position: "relative",
                width: "350px"
            }}
        >
            <FlexBetween
                sx={{
                    backgroundColor: neutralLight,
                    minWidth: "350px",
                }}
                borderRadius="9px"
                gap="2rem"
                padding="0.1rem 1.5rem"
            >
                <InputBase 
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => {
                        setLastCursor(null);
                        setQuery(e.target.value);
                    }}
                />
                <IconButton>
                    <Search />
                </IconButton>
            </FlexBetween>
           {users.length > 0 && <WidgetWrapper 
                sx={{
                    position: "absolute",
                    maxWidth: "100%",
                    minWidth: "100%",
                    top: "70px",
                }}
            >
               <CustomScroll
                    maxHeight="300px"
                    ref={ref}
                    onScroll={handleScroll}
                >
                    <Box 
                        display="flex" 
                        flexDirection="column" 
                        gap="1.5rem"
                        pr={hasScroll ? '16px' : '0px'}
                        sx={{
                            height: "300px",
                        }}
                    >
                        
                        {users.map((user: IUserListItem) => (
                            <Friend
                                key={user.id.toString()}
                                friendId={user.id.toString()}
                                name={`${user.firstName} ${user.lastName}`}
                                subtitle={user.location || ''}
                                userPhoto={user?.photo?.url || ""}
                                isFriend={user.isFriend || false}
                                canModifyFriendsList={true}
                            />
                        ))}
                    </Box>
                </CustomScroll>
            </WidgetWrapper>}
        </Box>
    )
}