import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Group Psalter Reading API',
      version: '1.0.0',
      description: 'API for managing group reading of the Psalter (kathismas).',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'sessionToken', // Adjust if cookie name is different
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
