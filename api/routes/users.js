"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Clerk webhook handler for user creation/updates
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), async (req, res, next) => {
    try {
        const evt = req.body;
        const { data, type } = evt;
        if (type === 'user.created') {
            await prisma.user.create({
                data: {
                    id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`.trim(),
                    role: 'USER',
                },
            });
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({ error: 'Webhook error' });
    }
});
// Get user role
router.get('/:id', auth_1.requireAuth, (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: { role: true },
    });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    res.json(user);
}));
// Update user role (admin only)
router.put('/:id/role', auth_1.requireAdmin, (0, express_async_handler_1.default)(async (req, res, next) => {
    const { role } = req.body;
    const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { role },
    });
    res.json(user);
}));
// Get all users (admin only)
router.get('/', auth_1.requireAdmin, (0, express_async_handler_1.default)(async (req, res, next) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },
    });
    res.json(users);
}));
exports.usersRouter = router;
