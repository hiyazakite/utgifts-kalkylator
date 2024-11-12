import 'reflect-metadata';
import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { AppDataSource } from './config/data-source';
import { personRoutes } from './routes/personRoutes';
import { householdRoutes } from './routes/householdRoutes';
import { expenseRoutes } from './routes/expenseRoutes';

const fastify = Fastify({
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
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'static'), // `static` within `build`
  prefix: '/', // Serve files at the root URL
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    fastify.log.info('Data Source has been initialized!');
  })
  .catch((error) => fastify.log.error('Error during Data Source initialization:', error));

// Register all API routes with a global '/api' prefix
fastify.register((instance, opts, done) => {
  instance.register(personRoutes);
  instance.register(householdRoutes);
  instance.register(expenseRoutes);
  done();
}, { prefix: '/api' });

// Redirect all other routes to index.html (for client-side routing)
fastify.setNotFoundHandler((request, reply) => {
  reply.sendFile('index.html'); // Serves the frontend for any unknown route
});

// Start the Fastify server
fastify.listen({ port: 5000, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info('Server listening on http://localhost:5000');
});
