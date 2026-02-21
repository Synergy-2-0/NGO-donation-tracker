import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DonorSphere - NGO Donation & Finance API",
            version: "1.0.0",
            description: "API documentation for Campaign Impact, Finance, and Transparency Modules",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        tags: [
            {
                name: "Finance - PayHere",
                description: "PayHere payment gateway integration",
            },
            {
                name: "Finance - Transactions",
                description: "Transaction management endpoints",
            },
            {
                name: "Finance - Allocations",
                description: "Fund allocation management",
            },
            {
                name: "Finance - Trust Score",
                description: "Trust score and transparency reports",
            },
            {
                name: "Finance - Audits",
                description: "Audit log management",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        tags: [
            { name: 'Users', description: 'User management endpoints' },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
