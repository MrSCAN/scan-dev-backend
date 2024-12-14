"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.requireAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)({});
const requireAdmin = async (req, res, next) => {
    try {
        await (0, exports.requireAuth)(req, res, async () => {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
            });
            if (user?.role !== 'ADMIN') {
                res.status(403).json({ message: 'Forbidden: Admin access required' });
                return;
            }
            next();
        });
    }
    catch (error) {
        next(error);
    }
};
exports.requireAdmin = requireAdmin;
