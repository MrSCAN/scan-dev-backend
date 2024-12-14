"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const projects_1 = require("./routes/projects");
const users_1 = require("./routes/users");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 4000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    credentials: true,
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Service is up and running!' });
});
// API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// API Routes
app.use('/api/projects', projects_1.projectsRouter);
app.use('/api/users', users_1.usersRouter);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});
