import { Box } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import MoviesPage from "../pages/MoviesPage"
import TvShows from "../pages/TvShows"
import NavBar from "./NavBar"
import Search from "../pages/Search"
import DetailsPage from "../pages/DetailsPage"
import WatchList from "../pages/WatchList"
import Protected from "./routes/Protected"

const Layout = () => {
    return (
        <Box>
            <NavBar />
            <Routes>
                <Route path='/' element={<Home />} />

                <Route path='/movies' element={<MoviesPage />} />

                <Route path='/tvshows' element={<TvShows />} />

                <Route path='/search' element={<Search />} />

                <Route path="/:type/:id" element={<DetailsPage />} />

                <Route 
                    path="/watchlist" 
                    element={
                        <Protected>
                            <WatchList />
                        </Protected>
                    } 
                />

            </Routes>
        </Box>
    )
}

export default Layout