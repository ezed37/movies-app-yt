import { Box, Container, Flex, Grid, Heading, Skeleton } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { fetchTrending } from "../services/api"
import CardComponent from "../components/CardComponent"

const Home = () => {

    const [data, setData] = useState([])
    const [loading, setloading] = useState(true)
    const [timeWindow, setTimeWindows] = useState("day")


    useEffect(() => {
        setloading(true)
        fetchTrending(timeWindow).then((data) => {
            setData(data.results)
        }).catch((err) => {
            console.log(err, "err")
        }).finally(() => {
            setloading(false)
        })
    }, [timeWindow])

    return (
        <Container maxW={"container.xl"}>
            <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
                <Heading as="h2" fontSize="20px" textTransform="uppercase" pb="20px">
                    Trending
                </Heading>

                <Flex alignItems={"center"} gap={"2"} border={"1px solid teal"} borderRadius={"20px"}>
                    <Box 
                        as="button" 
                        px="3" 
                        py="1" 
                        borderRadius={"20px"}
                        bg={`${timeWindow === "day" ? "green.300" : ""}`}
                        onClick={() => setTimeWindows("day")}
                    >
                        Today
                    </Box>
                    <Box 
                        as="button" 
                        px="3" 
                        py="1" 
                        borderRadius={"20px"} 
                        bg={`${timeWindow === "week" ? "green.300" : ""}`}
                        onClick={() => setTimeWindows("week")}
                        >
                            This Week
                    </Box>
                </Flex>
            </Flex>

            <Grid templateColumns={{
                base:"1fr",
                sm:"repeat(2, 1fr)",
                md:"repeat(4, 1fr)",
                lg:"repeat(5, 1fr)"
            }} gap="2">
                {data && data.map((item, i) => (
                    loading ? (
                        <Skeleton height={300} key={i} />
                    ) : (
                        <CardComponent key={item.id} item={item} type={item.media_type} />
                    )
                ))}
            </Grid>
        </Container>
    )
}

export default Home