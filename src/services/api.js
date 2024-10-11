export const imgUrl = "https://image.tmdb.org/t/p/w500"
export const imgUrlOriginal = "https://image.tmdb.org/t/p/original"

const baseUrl = "https://api.themoviedb.org/3";
const apiKey = import.meta.env.VITE_TMDB_API_KEY;


//Trending
export const fetchTrending = async (timeWindow='day') => {

    try {
        const res = await fetch(`${baseUrl}/trending/all/${timeWindow}?api_key=${apiKey}`);

        if (!res.ok) {
            return {success:false, message:"Error in Fetch Trendings"}
        }

        const data = await res.json();
        return data;


    } catch (err) {
        return {success:false, message:err.message}
    }
}


//Movies and series details
export const fetchDetails = async (type, id) => {
    try {
        const details = await fetch(`${baseUrl}/${type}/${id}?api_key=${apiKey}`);

        if (!details.ok) {
            return {success:false, message:"Error in Fetch Details"}
        }

        const det = await details.json();
        return det;

    } catch (err) {
        return {success:false, message:err.message}
    }
}


//Movies and series credits
export const fetchCredits = async (type, id) => {
    try {
        const credits = await fetch(`${baseUrl}/${type}/${id}/credits?api_key=${apiKey}`);

        if (!credits.ok) {
            return {success:false, message:"Error in Fetch Credits"}
        }

        const cred = await credits.json();
        return cred;

    } catch (err) {
        return {success:false, message:err.message}
    }
}

//Movies and series video
export const fetchVideos = async (type, id) => {
    try {
        const video = await fetch(`${baseUrl}/${type}/${id}/videos?api_key=${apiKey}`);

        if (!video.ok) {
            return {success:false, message:"Error in fetching videos"}
        }

        const vid = await video.json();
        return vid;

    } catch (err) {
        return {success:false, message:err.message}
    }
}


//Discover
export const fetchMovies = async (page ,sortBy) => {
    try {
        const response = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sortBy}`);

        if (!response.ok) {
            return {success:false, message:"Error in fetching movies"}
        }

        const res = await response?.json();
        return res;

    } catch (err) {
        return {success:false, message:err.message}
    }
}

//Discover tv series
export const fetchTvSeries = async (page ,sortBy) => {
    try {
        const response = await fetch(`${baseUrl}/discover/tv?api_key=${apiKey}&page=${page}&sort_by=${sortBy}`);

        if (!response.ok) {
            return {success:false, message:"Error in fetching series"}
        }

        const res = await response?.json();
        return res;

    } catch (err) {
        return {success:false, message:err.message}
    }
}

//Search
export const searchData = async (query, page) => {
    try {
        const response = await fetch(`${baseUrl}/search/multi?api_key=${apiKey}&query=${query}&page=${page}`);

        if (!response.ok) {
            return {success:false, message:"Error in search"}
        }

        const res = await response?.json();
        return res;

    } catch (err) {
        return {success:false, message:err.message}
    }
}