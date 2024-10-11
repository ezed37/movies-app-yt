import { Box, Flex, Image, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { imgUrl } from "../services/api"
import { StarIcon } from "@chakra-ui/icons"



const CardComponent = ({ item, type }) => {

    return (
        <Link to= {`/${type}/${item.id}`}>
            <Box 
                position="relative" 
                transform={"scale(1)"} 
                _hover={{
                transform: { base: "scale(1)", md:"scale(1.04)"},
                transition:"transform 0.2s ease-in-out",
                zIndex:"10",
                "& .overlay": {
                    opacity:1
                }
            }}>
                <Image src={`${imgUrl}/${item.poster_path}`} alt={item.title || item.name} height="100%" />

                <Box
                    className="overlay"
                    position="absolute" 
                    p={2} 
                    bottom={0} 
                    left={0} 
                    w="100%" 
                    h={"33%"} 
                    bg={"rgba(0,0,0,0.9)"} 
                    opacity={"0"}
                    transition={"opacity 0.3s ease-in-out"}
                    >
                        <Text textColor={"gray.100"} textAlign={"center"} fontSize={"large"} noOfLines={"1"}>{item.title || item.name}</Text>
                        <Text textColor={"gray.100"} fontSize={"small"} textAlign={"center"}>
                            {new Date(item.release_date || item.first_air_date).getFullYear() || "N/A"}
                        </Text>

                        <Flex
                            textColor={"gray.100"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            gap={2}
                            mt={2}
                            >
                            <StarIcon fontSize={"small"} />
                            <Text>{item.vote_average ? item.vote_average.toFixed(1) : "N/A"}</Text>
                        </Flex>
                </Box>
            </Box>
        </Link>
    )
}


export default CardComponent