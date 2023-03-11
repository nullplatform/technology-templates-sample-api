const axios = require('axios');
const {NestedError, tx} = require("./NestedError");


class MoviesService {
    constructor(apiKey, apiUrl) {
        this.apiKey = apiKey;
        this.apiURL = apiUrl;
    }

    toString() {
        return `MovieService(apiKey:${this.apiKey})`;
    }

    buildUrl(args) {
        try {
            const queryString = Object.entries(args)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            return `${this.apiURL}/?${queryString}&apikey=${this.apiKey}`;
        } catch (e) {
            throw new NestedError(`Error building url for ${JSON.stringify(args)}`, e);
        }
    }

    async searchMovie(title) {
        return await tx("search_movie", async (log) => {
            const url = this.buildUrl({type: "movie", s: title});
            log("url", url);
            let response = await axios.get(url);
            log("status", response.status);
            const movies = response.data.Search;
            if (movies) {
                log("movies_cnt", movies.length);
                return movies;
            }
            else
                throw new Error(`Movies not found with title: [${title}]`);
        });
    }

    async getMovieDetails(imdbID) {
        return await tx("get_movie", async (log) =>{
            log("imdbID", imdbID)

            const url = this.buildUrl({i: imdbID});
            log("url", url);

            let response = await axios.get(url);
            log("status", response.status);

            return response.data;
        });
    }
}

exports.MoviesService = MoviesService;


let test = async () => {
    const apiKey = process.env.MOVIES_API_KEY;
    const apiUrl = process.env.MOVIES_API_URL; //http://www.omdbapi.com

    let moviesService;

    if(!apiKey)
        console.log("ERROR: MOVIES_API_KEY parameter is not defined");
    if(!apiUrl)
        console.log("ERROR: MOVIES_API_URL parameter is not defined");
    if(apiUrl && apiKey)
        moviesService = new MoviesService(apiKey, apiUrl);
    else
        throw new Error("Missing environments");


    try {
        let movies = await moviesService.searchMovie("top gun");

        for (let i = 0; i < movies.length; i++) {
            let movie = movies[i];
            let details = await moviesService.getMovieDetails(movie.imdbID);
            movie["details"] = details.data;
        }

        //console.log(JSON.stringify(movies, null, '   '));
    } catch (e) {
        if (e instanceof NestedError && axios.isAxiosError(e.originalError())) {
            console.log("Axios Error!");
            console.log(e);
        } else {
            console.log(e);
        }

    }
};

//test();
