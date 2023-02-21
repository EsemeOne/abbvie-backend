const options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Abbvie App",
            version: "1.0.0",
            description:
                "Abbvie Base App",
        },
        servers: [
            {
                url: "http://development.computatus.com:61995/"
            },
            {
                url: "http://localhost:61995/"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ["**/routes/*.ts"],
};

module.exports = { options: options };
