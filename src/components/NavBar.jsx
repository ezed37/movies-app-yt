import { Avatar, Box, Button, Container, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons"

const NavBar = () => {
    const { user, signWithGoogle, logOut } = useAuth()
    const { onOpen, onClose, isOpen } = useDisclosure()

    const handleGoogleLogin = async () => {
        try {
            await signWithGoogle()
        console.log("Success")
        } catch (error) {
            console.log("err", error)
        }
    }

    return (
        <Box py={{ 
            base: "2", 
            sm: "2", 
            md: "4", 
            lg: "5" }}
            mb={{ 
                base: "1", 
                sm: "1", 
                md: "2", 
                lg: "3" }}
                >
            <Container maxW="container.xl">
                <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
                    <Link to='/'>
                        <Box
                            fontSize={{ 
                                base: "20px", 
                                sm: "24px", 
                                md: "32px", 
                                lg: "40px" }}
                            fontWeight={"bold"}
                            color={"red"}
                            letterSpacing={"widest"}
                            fontFamily={"mono"}
                        >
                            NETFLEX
                        </Box>
                    </Link>

                    {/* DESKTOP */}
                    <Flex
                        gap={"4"}
                        alignItems="center"
                        display={{base: "none", md: "flex"}}
                    >
                        <Link to='/'>Home</Link>
                        <Link to='/movies'>Movies</Link>
                        <Link to='/tvshows'>TV Shows</Link>
                        <Link to='/search'>
                            <SearchIcon fontSize={"xl"} />
                        </Link>
                        {user && (
                            <Menu>
                                <MenuButton>
                                    <Avatar 
                                        bg={"red.500"} 
                                        color={"white"} 
                                        size={"sm"} 
                                        name={user?.displayName} 
                                        src={user?.photoURL ? user.photoURL : ""}
                                    />
                                </MenuButton>

                                <MenuList>
                                    <Link to={"/watchlist"}>
                                        <MenuItem>WatchList</MenuItem>
                                    </Link>

                                    <MenuItem onClick={logOut}>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        )}

                        {!user && (
                            <Avatar size={"sm"} bg={"gray.800"} as={"button"} onClick={handleGoogleLogin} />
                        )}
                    </Flex>

                    {/* MOBILE */}
                    <Flex
                        display={{ base: "flex", md: "none" }}
                        alignItems={"center"}
                        gap="4"
                    >
                        <Link to="/search">
                        <SearchIcon fontSize={"xl"} />
                        </Link>
                        <IconButton onClick={onOpen} icon={<HamburgerIcon />} />
                        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                        <DrawerOverlay />
                        <DrawerContent bg={"black"}>
                            <DrawerCloseButton />
                            <DrawerHeader>
                            {user ? (
                                <Flex alignItems="center" gap="2">
                                <Avatar bg="red.500" size={"sm"} name={user?.email} />
                                <Box fontSize={"sm"}>
                                    {user?.displayName || user?.email}
                                </Box>
                                </Flex>
                            ) : (
                                <Avatar
                                size={"sm"}
                                bg="gray.800"
                                as="button"
                                onClick={handleGoogleLogin}
                                />
                            )}
                            </DrawerHeader>

                            <DrawerBody>
                            <Flex flexDirection={"column"} gap={"4"} onClick={onClose}>
                                <Link to="/">Home</Link>
                                <Link to="/movies">Movies</Link>
                                <Link to="/shows">TV Shows</Link>
                                {user && (
                                <>
                                    <Link to="/watchlist">Watchlist</Link>
                                    <Button
                                    variant={"outline"}
                                    colorScheme="red"
                                    onClick={logOut}
                                    >
                                    Logout
                                    </Button>
                                </>
                                )}
                            </Flex>
                            </DrawerBody>
                        </DrawerContent>
                        </Drawer>
                    </Flex>

                </Flex>
            </Container>
        </Box>
    )
}

export default NavBar