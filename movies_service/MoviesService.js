const axios = require('axios');
const {NestedError, UserError, logBlock} = require("@nullplatform/np-error-js");

class MoviesService {

    constructor(apiKey, apiUrl) {
        this.apiKey = apiKey;
        this.apiURL = apiUrl;
    }

    toString() {
        return `MovieService(apiKey:${this.apiKey};apiUrl${this.apiURL})`;
    }

    buildUrl(args) {
        try {
            const queryString = Object.entries(args)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            return `${this.apiURL}/?${queryString}&apikey=${this.apiKey}`;
        } catch (e) {
            throw new NestedError({message: `Error building url for ${JSON.stringify(args)}`, error: e});
        }
    }

    async searchMovie(title) {
        return await logBlock("search_movie", async (log) => {
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
                throw new UserError({message: `No movies found with title: [${title}]`, code: UserError.NOT_FOUND});
        });
    }

    async getMovieDetails(imdbID) {
        return await logBlock("get_movie", async (log) =>{
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
