import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0", // Version of the OpenAPI spec
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "API for MarketPlace JunFolio",
            contact: {
                name: "Dmytro Zinkovskyi",
                email: "dmytrozinkovsky@gmail.com",
            },
        },
        servers: [
            process.env.NODE_ENV === "prod"
                ? {
                      url: "https://mp.dimkagrek.pp.ua/api/v1",
                      description: "Production server",
                  }
                : {
                      url: "http://localhost:5050/api/v1",
                      description: "Development server",
                  },
        ],
    },
    apis: ["./routes/*.js", "./api-docs/*.yaml"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
