"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const authController = new authController_1.AuthController();
// Make sure the controller methods are bound correctly
router.post('/register', validation_1.validateRegister, (req, res) => authController.register(req, res));
router.post('/login', validation_1.validateLogin, (req, res) => authController.login(req, res));
exports.default = router;
