"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    // Simulate authentication via Header for development
    // In production, validate Entra ID JWT here
    const simulatedRole = req.headers['x-user-role'];
    const simulatedUser = req.headers['x-user-name'];
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        req.user = {
            id: 'mock-id',
            name: simulatedUser || 'Dev User',
            role: simulatedRole || 'ADMIN', // Default to ADMIN for dev convenience
        };
        return next();
    }
    // TODO: Add real JWT validation logic here
    res.status(401).json({ message: 'Unauthorized' });
};
exports.authMiddleware = authMiddleware;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
exports.requireRole = requireRole;
