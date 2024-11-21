"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
class AuthController {
    // Register new user
    async register(req, res) {
        try {
            const { email, password, username } = req.body;
            // Check if user exists
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        { username }
                    ]
                }
            });
            if (existingUser) {
                if (existingUser.email === email) {
                    res.status(400).json({
                        message: 'Email is already registered'
                    });
                    return;
                }
                if (existingUser.username === username) {
                    res.status(400).json({
                        message: 'Username is already taken'
                    });
                    return;
                }
            }
            // Hash password
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            // Create new user
            const newUser = await prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                    role: 'USER'
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    role: true
                }
            });
            // Generate token
            const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
            res.status(201).json({
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    username: newUser.username,
                    role: newUser.role
                }
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                message: 'Internal server error during registration'
            });
        }
    }
    // Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                res.status(401).json({
                    message: 'Invalid email or password'
                });
                return;
            }
            const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
            if (!isValidPassword) {
                res.status(401).json({
                    message: 'Invalid email or password'
                });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
            res.status(200).json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                message: 'Internal server error during login'
            });
        }
    }
}
exports.AuthController = AuthController;
