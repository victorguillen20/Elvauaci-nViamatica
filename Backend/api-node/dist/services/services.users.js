"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.Login = exports.updateUsers = exports.insertUsers = exports.getUsers = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const repositories_users_1 = require("../repositories/repositories.users");
const repositories_users_verificaciones_1 = require("../repositories/repositories.users.verificaciones");
const validaciones_1 = require("../utils/validaciones");
const repositories_admin_1 = require("../repositories/repositories.admin");
const repositories_obtener_users_1 = require("../repositories/repositories.obtener.users");
const repositories_registros_1 = require("../repositories/repositories.registros");
const repositories_actualizar_users_1 = require("../repositories/repositories.actualizar.users");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, repositories_admin_1.obtenertodoslosUsuarios)();
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error...');
    }
});
exports.getAllUsers = getAllUsers;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        const parametrovalidado = (0, validaciones_1.validarParametro)(username);
        if (parametrovalidado == 'email') {
            const response = yield (0, repositories_obtener_users_1.obtenerDatosPersonaYUsuarioPorMail)(username);
            return res.status(200).json(response);
        }
        const response = yield (0, repositories_obtener_users_1.obtenerDatosPersonaYUsuarioPorUsername)(username);
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error...');
    }
});
exports.getUsers = getUsers;
const insertUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, nombres, apellidos, identificacion, fechanacimiento } = req.body;
    try {
        const correogeneradoPromise = (0, validaciones_1.generarCorreoElectronico)(nombres, apellidos);
        const correogenerado = yield correogeneradoPromise;
        console.log(correogenerado);
        const usuariovalidadoPromise = (0, validaciones_1.validarUsuario)(username);
        const usuariovalidado = yield usuariovalidadoPromise;
        if (usuariovalidado !== 'true') {
            console.log(usuariovalidado);
            return res.status(200).json({ registrodeusuario: usuariovalidado });
        }
        const passwordvalidado = (0, validaciones_1.validarPassword)(password);
        if (passwordvalidado !== 'true') {
            console.log(passwordvalidado);
            return res.status(200).json({ registrodeusuario: passwordvalidado });
        }
        const identificacionvalidada = (0, validaciones_1.validarIdentificacion)(identificacion);
        if (identificacionvalidada !== 'true') {
            console.log(identificacionvalidada);
            return res.status(200).json({ registrodeusuario: identificacionvalidada });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const response = yield (0, repositories_registros_1.registrarUsuarioEstandar)(username, hashedPassword, correogenerado, nombres, apellidos, identificacion, fechanacimiento);
        if (response == false) {
            return res.status(500).json({ message: 'Error al cargar los datos' });
        }
        return res.status(200).json({ registrodeusuario: true });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ registrodeusuario: false });
    }
});
exports.insertUsers = insertUsers;
const updateUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, nombres, apellidos, identificacion, fechanacimiento } = req.body;
    try {
        const usuariovalidadoPromise = (0, validaciones_1.validarUsuario)(username);
        const usuariovalidado = yield usuariovalidadoPromise;
        if (usuariovalidado !== 'true') {
            console.log(usuariovalidado);
            return res.status(200).json({ registrodeusuario: usuariovalidado });
        }
        const passwordvalidado = (0, validaciones_1.validarPassword)(password);
        if (passwordvalidado !== 'true') {
            console.log(passwordvalidado);
            return res.status(200).json({ registrodeusuario: passwordvalidado });
        }
        const identificacionvalidada = (0, validaciones_1.validarIdentificacion)(identificacion);
        if (identificacionvalidada !== 'true') {
            console.log(identificacionvalidada);
            return res.status(200).json({ registrodeusuario: identificacionvalidada });
        }
        const idusuario = yield (0, repositories_obtener_users_1.obtenerIdUsuarioPorUsername)(username);
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const response = yield (0, repositories_actualizar_users_1.actualizarUsuarios)(idusuario, username, hashedPassword, nombres, apellidos, identificacion, fechanacimiento);
        if (response == false) {
            return res.status(500).json({ updateusers: false, message: 'Error al cargar los datos' });
        }
        return res.status(200).json({ updateusers: true, message: 'Datos actualizados' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ updateusers: false, message: 'Error al actualizar los datos' });
    }
});
exports.updateUsers = updateUsers;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const parametrovalidado = (0, validaciones_1.validarParametro)(username);
        if (parametrovalidado == 'email') {
            const response = yield (0, repositories_users_1.existemailenusuarios)(username);
            if (response) {
                const idusuario = yield (0, repositories_obtener_users_1.obteneridusuariopormail)(username);
                const verificacion = yield (0, repositories_users_verificaciones_1.verificarUsuarioBloqueado)(idusuario);
                if (verificacion) {
                    return res.status(200).json({ login: false, rol: '', message: 'El usuario se encuentra bloqueado' });
                }
                const hashedPasswordfromDB = yield (0, repositories_users_1.tomarPasswordHashedporelMail)(username);
                if (hashedPasswordfromDB == 'false') {
                    return res.status(500).json({ login: false, rol: '', message: 'Existe un error al comparar los datos.' });
                }
                else {
                    const isMatch = yield bcrypt_1.default.compare(password, hashedPasswordfromDB);
                    if (!isMatch) {
                        const idusuario = yield (0, repositories_obtener_users_1.obteneridusuariopormail)(username);
                        yield (0, repositories_actualizar_users_1.actualizarIntentosSesion)(idusuario);
                        return res.status(500).json({ login: false, rol: '', message: 'Password incorrecto' });
                    }
                    const fechayhora = (0, validaciones_1.obtenerFechaHoraActual)();
                    const idusuario = yield (0, repositories_obtener_users_1.obteneridusuariopormail)(username);
                    yield (0, repositories_registros_1.registrarentrada)(fechayhora, idusuario);
                    const rolusuario = yield (0, repositories_obtener_users_1.obtenerRolDeUsuario)(idusuario);
                    return res.status(200).json({ login: true, rol: rolusuario, message: 'credenciales correctas' });
                }
            }
            else {
                return res.status(404).json({ login: true, rol: '', message: 'credenciales incorrectas' });
            }
        }
        const response = yield (0, repositories_users_1.userExist)(username);
        if (response) {
            const idusuario = yield (0, repositories_obtener_users_1.obtenerIdUsuarioPorUsername)(username);
            const verificacion = yield (0, repositories_users_verificaciones_1.verificarUsuarioBloqueado)(idusuario);
            if (verificacion) {
                return res.status(200).json({ login: false, rol: '', message: 'El usuario se encuentra bloqueado' });
            }
            const hashedPasswordfromDB = yield (0, repositories_users_1.tomarPasswordHashed)(username);
            if (hashedPasswordfromDB == 'false') {
                return res.status(404).json({ login: false, rol: '', message: 'Credenciales incorrectas' });
            }
            const isMatch = yield bcrypt_1.default.compare(password, hashedPasswordfromDB);
            if (!isMatch) {
                const idusuario = yield (0, repositories_obtener_users_1.obteneridusuariopormail)(username);
                yield (0, repositories_actualizar_users_1.actualizarIntentosSesion)(idusuario);
                return res.status(404).json({ login: false, rol: '', message: 'Credenciales incorrectas' });
            }
            const fechayhora = (0, validaciones_1.obtenerFechaHoraActual)();
            yield (0, repositories_registros_1.registrarentrada)(fechayhora, idusuario);
            const rolusuario = yield (0, repositories_obtener_users_1.obtenerRolDeUsuario)(idusuario);
            return res.status(201).json({ login: true, rol: rolusuario, message: 'Login exitoso' });
        }
        else {
            return res.status(500).json({ login: false, rol: '', message: 'Credenciales incorrectas' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ login: false });
    }
});
exports.Login = Login;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    try {
        const parametrovalidado = (0, validaciones_1.validarParametro)(username);
        if (parametrovalidado == 'email') {
            const idusuario = yield (0, repositories_obtener_users_1.obteneridusuariopormail)(username);
            const fechayhora = (0, validaciones_1.obtenerFechaHoraActual)();
            yield (0, repositories_registros_1.registrarsalida)(fechayhora, idusuario);
            return res.status(200).json({ logout: true });
        }
        const idusuario = yield (0, repositories_obtener_users_1.obtenerIdUsuarioPorUsername)(username);
        const fechayhora = (0, validaciones_1.obtenerFechaHoraActual)();
        yield (0, repositories_registros_1.registrarsalida)(fechayhora, idusuario);
        return res.status(200).json({ logout: true });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ logout: false });
    }
});
exports.logOut = logOut;
