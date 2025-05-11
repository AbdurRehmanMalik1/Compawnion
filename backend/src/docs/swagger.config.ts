import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Compawnion API Documentation",
      version: "1.0.0",
      description: "API documentation for Compawnion application",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/docs/**/*.swagger.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
