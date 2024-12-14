"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
exports.swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Hobbyist Haven API',
        version: '1.0.0',
        description: 'API documentation for Hobbyist Haven project',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    paths: {
        '/api/projects': {
            get: {
                summary: 'Get all projects',
                responses: {
                    '200': {
                        description: 'List of projects',
                    },
                },
            },
            post: {
                summary: 'Create a new project',
                security: [{ BearerAuth: [] }],
                responses: {
                    '201': {
                        description: 'Project created successfully',
                    },
                },
            },
        },
        // ... Add more endpoint documentation as needed
    },
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
    },
};
