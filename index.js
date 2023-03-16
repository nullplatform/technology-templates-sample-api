const fastify = require('fastify')({ logger: { level: 'error' } });
const {MoviesService} = require('./movies_service/MoviesService');
const {logBlock, NestedError, UserError} = require("@nullplatform/np-error-js");
const cors = require('@fastify/cors');

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 8080;

let moviesService;

const ERROR_NO_ARGUMENT = "CONTROLLER_MOVIE_NO_ARGUMENT";
const CONTROLLER_MOVIE_NO_ARGUMENT = "CONTROLLER_MOVIE_NO_ARGUMENT";



fastify.register(cors, {
    origin: true, // allow all origins
    credentials: true // allow sending of credentials
});

// Declare a route
fastify.get('/movie', async (request, reply) => {
    try {
        if (!moviesService)
            throw new UserError({message: "Either MOVIES_API_KEY or MOVIES_API_URL parameter is missing", code: UserError.NOT_AUTHORIZED});

        let searchString = request.query.q;

        if (searchString) {
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
            throw new UserError({message: "Argument q is required", code: UserError.INVALID_ARGUMENT});
        }
    } catch (e) {
        console.log(e);
        if(e instanceof NestedError) {
            let userError = e.userError();
            if(userError && userError.code == UserError.NOT_AUTHORIZED)
                reply.statusCode = 401;
            else
                reply.statusCode = 400;
            return {message: userError.userMessage, code: userError.code};
        } else {
            reply.statusCode = 400;
            return {message: "Unknown Error"};
        }
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
        const apiUrl = process.env.MOVIES_API_URL;

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
