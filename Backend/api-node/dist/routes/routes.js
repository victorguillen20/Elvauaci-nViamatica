"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_users_1 = require("../controllers/controllers.users");
const router = (0, express_1.Router)();
router.get('/users/profile', controllers_users_1.getUsers);
router.get('/users', controllers_users_1.getAllUsers);
router.post('/users/login', controllers_users_1.Login);
router.post('/users/registrar', controllers_users_1.insertUsers);
router.delete('/users/delete');
exports.default = router;
