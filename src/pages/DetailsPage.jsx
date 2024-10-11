import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Badge, Box, Button, CircularProgress, CircularProgressLabel, Container, Flex, Heading, Image, Spinner, Text, useToast } from "@chakra-ui/react";
import { fetchCredits, fetchDetails, fetchVideos, imgUrl, imgUrlOriginal } from "../services/api";
import { CalendarIcon, CheckCircleIcon, SmallAddIcon, TimeIcon } from "@chakra-ui/icons";
import { minutesToHours, ratingToPercentage, resolveRatingColor } from "../utils/helpers";
import VideoComponent from "../components/VideoComponent";
import { useAuth } from "../context/useAuth";
import { useFireStore } from "../services/firestore";


const DetailsPage = () => {
    
    const router = useParams()
    const { type, id } = router;

    const { user } = useAuth()
    const { addToWatchlist, checkIfInWatchlist, removeFromWatchlist } = useFireStore()
    const toast = useToast()

    const [details, setDetails] = useState({})
    const [cast, setCast] = useState([])
    const [video, setVideo] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [isInWatchlist, setIsInWatchlist] = useState(false)    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detailData, creditsData, videosData] = await Promise.all([
                    fetchDetails(type, id),
                    fetchCredits(type, id),
                    fetchVideos(type, id),
                ])
                
                //set details
                setDetails(detailData)

                //set cast
                setCast(creditsData.cast.slice(0,10))

                //set videos
                const video = videosData?.results?.find((video) => video.type === "Trailer")
                setVideo(video)
                
                const videos = videosData?.results?.filter((videos) => videos.type !== "Trailer").slice(0, 10)
                setVideos(videos)
            } catch (err) {
                console.log(err, "err")
            } finally {
                setLoading(false)
            }
        }

        fetchData ()
    }, [type,id])
    
    const handleSaveToWatchlist = async () => {
        if (!user) {
            toast({
                title: "Login to add to watchlist",
                status: "error",
                isClosable: true,
            })

            return //If user not found, function will be stoped
        }
        const data = {
            id: details?.id,
            title: details?.title || details?.name,
            type: type,
            poster_path: details?.poster_path,
            release_date: details?.release_date || details?.first_air_date,
            vote_average: details?.vote_average,
            overview: details?.overview,
        }

        //console.log(data, "data")
        //addDocument("watchlist", data)

        const dataId = details?.id?.toString()

        await addToWatchlist(user?.uid, dataId, data)

        const isSetToWatchlist = await checkIfInWatchlist(user?.uid, dataId)
        setIsInWatchlist(isSetToWatchlist)
    }

    useEffect(() => {
        if (!user) {
            setIsInWatchlist(false)
            return;
        }

        checkIfInWatchlist(user?.uid, id).then((data) => {
            setIsInWatchlist(data)
        })
    }, [id, user, checkIfInWatchlist])
    


    const handleRemoveFromWatchlist = async () => {
        await removeFromWatchlist(user?.uid, id)
        const isSetToWatchlist = await checkIfInWatchlist(user?.uid, id)
        setIsInWatchlist(isSetToWatchlist)
    }


    if (loading) {
        return (
            <Flex justify={"center"}>
                <Spinner size={"xl"} color="red" />
            </Flex>
        )
    }

    const title = details.title || details.name
    const releaseDate = type === "tv" ? details.first_air_date : details.release_date

    return (
        <Box>
            <Box 
                background={`linear-gradient(rgba(0,0,0,.88), rgba(0,0,0,.88)), url(${imgUrlOriginal}/${details.backdrop_path})`}
                backgroundRepeat={"no-repeat"}
                backgroundSize={"cover"}
                backgroundPosition={"center"}
                w={"100%"}
                h={{base:"auto", md:"500px"}}
                p={"2"}
                zIndex={"-1"}
                display={"flex"}
                alignItems={"center"}
            >
                <Container maxW={"container.xl"}>
                    <Flex
                        alignItems={"center"}
                        gap={"10"}
                        flexDirection={{ base:"column", md:"row"}}
                    >
                        <Image
                            height={"450px"}
                            borderRadius={"sm"}
                            src={`${imgUrl}/${details.poster_path}`}
                        />

                        <Box>
                            <Heading fontSize={"3xl"} color={"gray.100"}>
                                <Text as={"span"} pr={"3"}>
                                    {title}
                                </Text>
                                <Text as="span" fontWeight="normal" color="gray.400">
                                    {new Date(releaseDate).getFullYear()}
                                </Text>
                            </Heading>

                            <Flex alignItems={"center"} gap={"4"} mt={1} mb={5}>
                                <Flex alignItems={"center"}>
                                    <CalendarIcon mr={2} color={"gray.400"} />
                                    <Text fontSize={"sm"} color={"gray.100"}>
                                        {new Date(releaseDate).toLocaleDateString("en-US")} (US)
                                    </Text>
                                </Flex>

                                {type === "movie" && (
                                <>
                                    <Box>*</Box>
                                    <Flex alignItems={"center"} color={"gray.100"}>
                                        <TimeIcon mr={"2"} color={"gray.400"} />
                                        <Text fontSize={"sm"}>{minutesToHours(details?.runtime)}</Text>
                                    </Flex>
                                </>
                                )}
                            </Flex>

                            <Flex alignItems={"center"} gap={"4"}>
                                <CircularProgress 
                                    value={ratingToPercentage(details.vote_average)} 
                                    bg={"gray.800"} 
                                    borderRadius={"full"} 
                                    p={"0.5"} 
                                    size={"70px"} 
                                    color={resolveRatingColor(details.vote_average)} 
                                    thickness={"6px"}
                                >
                                    <CircularProgressLabel 
                                        fontSize={"lg"} 
                                        color={"gray.100"}
                                    >
                                        {ratingToPercentage(details.vote_average)} {" "}
                                        <Box as="span" fontSize={"10px"}>%</Box>
                                    </CircularProgressLabel>
                                </CircularProgress>
                                <Text display={{base:"none", md:"initial"}} color={"gray.100"}>
                                    User Score
                                </Text>

                                {isInWatchlist ? (
                                    <Button
                                        leftIcon={<CheckCircleIcon />} 
                                        colorScheme="green" 
                                        variant={"outline"} 
                                        onClick={handleRemoveFromWatchlist} 
                                    >
                                        In watchlist
                                    </Button>
                                ) : (
                                    <Button 
                                        leftIcon={<SmallAddIcon />} 
                                        variant={"outline"}
                                        colorScheme="teal"
                                        borderColor={"white"}
                                        color={"white"}
                                        onClick={handleSaveToWatchlist} 
                                    >
                                        Add to watchlist
                                    </Button>
                                )}

                            </Flex>

                            <Text color={"gray.400"} fontSize={"sm"} fontStyle={"italic"} mb={"3"}>{details.tagline}</Text>
                            <Heading
                                fontSize={"xl"}
                                mb={"3"}
                                color={"gray.100"}
                            >
                                Overview
                            </Heading>

                            <Text
                                fontSize={"mb"}
                                mb={"3"}
                                color={"gray.100"}
                            >
                                {details.overview}
                            </Text>

                            <Flex
                                mt={"6"}
                                gap={"2"}
                                p={"1"}
                            >
                                {details.genres.map((genre) => (
                                    <Badge key={genre.id}>{genre.name}</Badge>
                                ))}
                            </Flex>
                        </Box>
                    </Flex>
                </Container>
            </Box>


            <Container maxW={"container.xl"} pb={"10"}>
                <Heading
                    as={"h2"}
                    fontSize={"md"}
                    textTransform={"uppercase"}
                    mt={"10"}
                >
                    Cast
                </Heading>

                <Flex
                    mt={"5"}
                    mb={"10"}
                    overflowX={"scroll"}
                    gap={"5"}
                >
                    {cast.length === 0 && <Text>No cast found</Text>}
                    {cast && cast.map((item) => (
                        <Box key={item.id} minW={"150px"}>
                            <Image src={`${imgUrl}/${item.profile_path}`} alt="" />
                        </Box>
                    ))}
                </Flex>

                <Heading 
                    as={"h2"} 
                    fontSize={"md"}  
                    textTransform={"uppercase"}
                    mt={"10"}
                    mb={"5"}
                >
                    Videos
                </Heading>
                <VideoComponent id={video?.key} />
                <Flex
                    mt={"5"}
                    mb={"10"}
                    overflowX={"scroll"}
                    gap={"5"}
                >
                    {videos && videos?.map ((item) => (
                        <Box key={item?.id} minW={"290px"}>
                            <VideoComponent id={item?.key} small />
                            <Text fontSize={"sm"} fontWeight={"bold"} mt={"2"} noOfLines={2}>{item?.name}</Text>
                        </Box>
                    ))}
                </Flex>
            </Container>
        </Box>
    )
}

export default DetailsPage