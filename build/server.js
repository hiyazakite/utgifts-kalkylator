"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const fastify_1 = __importDefault(require("fastify"));
const path_1 = __importDefault(require("path"));
const static_1 = __importDefault(require("@fastify/static"));
const data_source_1 = require("./config/data-source");
const personRoutes_1 = require("./routes/personRoutes");
const householdRoutes_1 = require("./routes/householdRoutes");
const expenseRoutes_1 = require("./routes/expenseRoutes");
const fastify = (0, fastify_1.default)({
    logger: {
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
                messageFormat: '[{levelLabel}] - {msg}',
            },
        },
    },
});
// Serve static files from the frontend's build directory
fastify.register(static_1.default, {
    root: path_1.default.join(__dirname, 'static'), // `static` within `build`
    prefix: '/', // Serve files at the root URL
});
// Initialize the data source
data_source_1.AppDataSource.initialize()
    .then(() => {
    fastify.log.info('Data Source has been initialized!');
})
    .catch((error) => fastify.log.error('Error during Data Source initialization:', error));
// Register all API routes with a global '/api' prefix
fastify.register((instance, opts, done) => {
    instance.register(personRoutes_1.personRoutes);
    instance.register(householdRoutes_1.householdRoutes);
    instance.register(expenseRoutes_1.expenseRoutes);
    done();
}, { prefix: '/api' });
// Redirect all other routes to index.html (for client-side routing)
fastify.setNotFoundHandler((request, reply) => {
    reply.sendFile('index.html'); // Serves the frontend for any unknown route
});
// Start the Fastify server
fastify.listen({ port: 5000 }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info('Server listening on http://localhost:5000');
});
