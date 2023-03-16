const fastify = require('fastify')({ logger: { level: 'error' } });
const {MoviesService} = require('./movies_service/MoviesService');
const cors = require('@fastify/cors');

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 8080;

let moviesService;

fastify.register(cors, {
    origin: true, // allow all origins
    credentials: true // allow sending of credentials
});

// Declare a route
fastify.get('/movie', async (request, reply) => {
    const start = Date.now();
    let error;
    let searchString = request.query.q;

    try {
        if (!moviesService) {
            console.log("here!")
            reply.code(401);
            return {message: "Either MOVIES_API_KEY or MOVIES_API_URL parameter is missing"};
        }

        if (searchString) {
            let movies = await moviesService.searchMovie(searchString);
            if (!movies) {
                reply.code(404);
                return {message: `No movies found for ${searchString}`}
            }

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
            reply.code(200)
            return movies;
        } else {
            reply.code(400);
            return {message: `Argument q is required, call /movie?q=top gun`};
        }
    } catch (e) {
        console.log(e);
        reply.code(500);
        return {message: `Internal server error`};
    } finally {
        console.log(JSON.stringify({
            search: searchString,
            operation: "/movie",
            code: reply?.statusCode,
            error: error?.toString(),
            duration: Date.now() - start
        }))
    }
});

fastify.get('/', async (request, reply) => {
    reply.redirect(301, '/movie?q=zombies');
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
