const fastify = require('fastify')({ logger: { level: 'error' } });
const {MoviesService} = require('./moviesService');
const {tx} = require("./NestedError");

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 8080;

let moviesService;

// Declare a route
fastify.get('/movie', async (request, reply) => {
    if(!moviesService)
        return {message: "Either MOVIES_API_KEY or MOVIES_API_URL parameter is missing"}

    let searchString = request.query.q;

    if(searchString) {
        let movies = await moviesService.searchMovie(searchString);
        let promises = [];
        for (let i = 0; i < movies.length; i++) {
            let movie = movies[i];
            promises.push(new Promise(async (resolve, reject) => {
                let details = await moviesService.getMovieDetails(movie.imdbID);
                movie["details"] = details;
                resolve();
            }));
        }
        await Promise.all(promises);
        return movies;
    } else {
        return { message: "Argument q is required" };
    }
});

//Health
fastify.get('/health', async (request, reply) => {
    return { status: 'ok' };
})

// Run the server!
const start = async () => {
    try {
        const apiKey = process.env.MOVIES_API_KEY;
        const apiUrl = process.env.MOVIES_API_URL; //http://www.omdbapi.com

        if(!apiKey)
            console.log("ERROR: MOVIES_API_KEY parameter is not defined");
        if(!apiUrl)
            console.log("ERROR: MOVIES_API_URL parameter is not defined");
        if(apiUrl && apiKey)
            moviesService = new MoviesService(apiKey, apiUrl);

        await fastify.listen({ host: HOST, port: PORT });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
