"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const zod_1 = require("zod");
// Validation schemas
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password is too long" }),
    username: zod_1.z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(50, { message: "Username is too long" })
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z.string().min(1, { message: "Password is required" })
});
const validateRegister = (req, res, next) => {
    try {
        registerSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: 'Validation failed',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        res.status(400).json({
            message: 'Invalid input'
        });
    }
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    try {
        loginSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: 'Validation failed',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        res.status(400).json({
            message: 'Invalid input'
        });
    }
};
exports.validateLogin = validateLogin;
