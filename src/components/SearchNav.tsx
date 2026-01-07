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
    const medium = theme.palette.neutral.medium;
    const popoverShadow = theme.shadows[10];
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [lastCursor, setLastCursor] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);

    const {list: users, count} = useSelector((state: RootState) => state.users);
    const { hasScroll, ref } = useHasVerticalScroll(users?.length || 0);

    const onFocus = () => setIsOpen(true);
    const onBlur = () => setIsOpen(false);

    // console.log("users from search", users);
    // console.log("count from search", typeof count);
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
        refetchOnFocus: false,
        refetchOnReconnect: false,
    })

    useEffect(()=> {
        if (debouncedQuery === ""){
            dispatch(overwriteUsers({users: [], count: 0}));
        }

    }, [debouncedQuery])

    
    const handleUpdateList = () => {
		const newCursor = users.length > 0 ? users[users.length-1].id : null;
		if (lastCursor !== newCursor) {
			setLastCursor(newCursor);
		}
	}

    const handleScroll = (e: Event) => {
        const target = e.target as HTMLElement
        const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

        if (scrollBottom < 5 && !isFetching && data?.hasMore) {
		  	handleUpdateList();
		}
    }

    return (
        <Box 
            sx={{
                position: "relative",
                width: "350px",
                // "&:hover .user-widget": {
                //     display: "block",
                // }
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
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                <Box display="flex" alignItems="center" gap="0.5rem">
                    {!!count && count > 0 &&  <Typography color={medium} fontWeight="500">
                        {count}
                    </Typography>}
                    <IconButton>
                        <Search />
                    </IconButton>
                </Box>
                
            </FlexBetween>
           {isOpen && <WidgetWrapper 
                sx={{
                    position: "absolute",
                    maxWidth: "100%",
                    minWidth: "100%",
                    top: "70px",
                    boxShadow: popoverShadow,
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                }}
                className="user-widget"
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
                            minHeight: "55px",
                            maxHeight: "300px",
                        }}
                    >
                        
                        {users && users.length > 0 ? users.map((user: IUserListItem) => (
                            <Friend
                                key={user.id.toString()}
                                friendId={user.id.toString()}
                                name={`${user.firstName} ${user.lastName}`}
                                subtitle={user.location || ''}
                                userPhoto={user?.photo?.url || ""}
                                isFriend={user.isFriend || false}
                                canModifyFriendsList={true}
                            />
                        )) : (
                            <Box 
                                display="flex" 
                                justifyContent="center" 
                                alignItems="center"
                                flex="1"
                            >
                                <Typography color={medium} fontWeight="500">
                                    {isLoading || isFetching ? "Loading..." : "No users found"}
                                </Typography>
                            </Box>)
                        }
                    </Box>
                </CustomScroll>
            </WidgetWrapper>}
        </Box>
    )
}