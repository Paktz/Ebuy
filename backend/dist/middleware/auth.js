"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = { id: decoded.userId };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            // Handle invalid token format
            return res.status(403).json({
                message: 'Invalid token format',
                error: error.message
            });
        }
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            // Handle expired token
            return res.status(401).json({
                message: 'Token expired',
                error: error.message
            });
        }
        if (error instanceof jsonwebtoken_1.NotBeforeError) {
            // Handle token that's not active yet
            return res.status(403).json({
                message: 'Token not active',
                error: error.message
            });
        }
        // Handle any other types of errors
        return res.status(403).json({
            message: 'Authentication error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.authenticateToken = authenticateToken;
