import { useEffect, useState } from "react"
import { useAuth } from "../context/useAuth"
import { useFireStore } from "../services/firestore"
import { Container, Flex, Grid, Heading, Spinner } from "@chakra-ui/react"
import WatchlistCard from "../components/WatchlistCard"

const WatchList = () => {

    const { getWatchlist } = useFireStore()
    const { user } = useAuth()

    const [watchlist, setWatchlist] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user?.uid) {
            getWatchlist(user?.uid)
            .then((data) => {
                setWatchlist(data)
                console.log(data)
            }).catch((err) => {
                console.log(err, "Error")
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }, [user?.uid, getWatchlist])
    
    return (
        <Container maxW={"container.xl"}>
            <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
                <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"}>
                    Watchlist
                </Heading>
            </Flex>

            {isLoading && (
                <Flex justify={"center"} mt={"10"}>
                    <Spinner size={"xl"} color="red" />
                </Flex>
            )}

            {!isLoading && watchlist?.length === 0 && (
                <Flex justify={"center"} mt={"10"}>
                    <Heading 
                        as={"h2"} 
                        fontSize={"md"} 
                        textTransform={"uppercase"}
                    >
                        Watch list is empty
                    </Heading>
                </Flex>
            )}

            {!isLoading && watchlist?.length > 0 && (
                <Grid 
                    templateColumns={{
                        base: "1fr"
                    }}
                    gap={"4"}
                >

                    {watchlist?.map((item) => (
                        <WatchlistCard
                            key={item?.id}
                            item={item}
                            type={item?.type}
                            setWatchlist={setWatchlist}
                        />
                    ))}
                </Grid>
            )}
        </Container>
    )
}

export default WatchList