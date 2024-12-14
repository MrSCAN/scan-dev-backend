"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Get all projects
router.get('/', (0, express_async_handler_1.default)(async (req, res, next) => {
    const projects = await prisma.project.findMany({
        include: {
            author: true,
            stages: true,
        },
    });
    res.json(projects);
}));
// Get a single project by ID
router.get('/:id', (0, express_async_handler_1.default)(async (req, res, next) => {
    const project = await prisma.project.findUnique({
        where: { id: req.params.id },
        include: {
            author: true,
            stages: true,
        },
    });
    if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
    }
    res.json(project);
}));
// Create a new project (requires authentication)
router.post('/', auth_1.requireAuth, (0, express_async_handler_1.default)(async (req, res, next) => {
    const { title, description, techStack, repoUrls, imageUrl, documentation, youtubeUrl, stages } = req.body;
    if (!title || !description) {
        res.status(400).json({ message: 'Title and description are required' });
        return;
    }
    const project = await prisma.project.create({
        data: {
            title,
            description,
            techStack: techStack || [],
            repoUrls: repoUrls || [],
            imageUrl: imageUrl || '',
            documentation: documentation || '',
            youtubeUrl,
            stages: {
                create: stages || [],
            },
            authorId: req.user.id,
        },
        include: {
            author: true,
            stages: true,
        },
    });
    res.status(201).json(project);
}));
// Update a project by ID (requires authentication)
router.put('/:id', auth_1.requireAuth, (0, express_async_handler_1.default)(async (req, res, next) => {
    const { title, description, techStack, repoUrls, imageUrl, documentation, youtubeUrl, stages } = req.body;
    const project = await prisma.project.update({
        where: { id: req.params.id },
        data: {
            title,
            description,
            techStack,
            repoUrls,
            imageUrl,
            documentation,
            youtubeUrl,
            stages: {
                deleteMany: {},
                create: stages,
            },
        },
        include: {
            author: true,
            stages: true,
        },
    });
    res.json(project);
}));
// Delete a project by ID (requires authentication)
router.delete('/:id', auth_1.requireAuth, (0, express_async_handler_1.default)(async (req, res, next) => {
    await prisma.project.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
}));
exports.projectsRouter = router;
