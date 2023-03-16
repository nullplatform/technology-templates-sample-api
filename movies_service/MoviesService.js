const axios = require('axios');

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
            let err= new Error(`Error building url for ${JSON.stringify(args)}`);
            err.cause = e;
            throw err;
        }
    }

    async searchMovie(title) {
        const url = this.buildUrl({type: "movie", s: title});
        const start = Date.now();
        let quantity;
        let status;
        let error;

        try {
            let response = await axios.get(url);
            status = response.status;
            const movies = response.data.Search;
            if (movies)
                quantity = movies.length;

            return movies;
        } catch (e) {
            error = e;
            e = new Error(`Error searching for ${title}`);
            e.cause = error;
            throw e;
        } finally {
            const end = Date.now();
            console.log(JSON.stringify({
                operation: "search_movie",
                duration: end-start,
                title,
                url,
                status,
                quantity,
                error: error?.toString()
            }))
        }
    }

    async getMovieDetails(imdbID) {
        const url = this.buildUrl({i: imdbID});
        const start= Date.now();
        let status;
        let error;
        try {
            let response = await axios.get(url);
            status = response.status;
            return response.data;
        } catch (e) {
            error = e;
            e = new Error(`Error getting movie for ${imdbID}`);
            e.cause = error;
            throw e;
        } finally {
            const end = Date.now();
            console.log(JSON.stringify({
                operation: "search_movie",
                duration: end-start,
                imdb_id: imdbID,
                url,
                status,
                error: error.toString()
            }))
        }
    }
}

exports.MoviesService = MoviesService;
