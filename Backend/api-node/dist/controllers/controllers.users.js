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
exports.Login = exports.insertUsers = exports.getUsers = exports.getAllUsers = void 0;
const database_conection_1 = require("../database.conection");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validaciones_1 = require("../utils/validaciones");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_conection_1.pool.query('select*from obtenertodoslosUsuarios()');
        return res.status(200).json(response.rows);
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
        const response = yield database_conection_1.pool.query('select*from obtenerDatosPersonaYUsuarioPorUsername($1)', [username]);
        return res.status(200).json(response.rows);
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
        //Generamos el correo electronico
        const correogeneradoPromise = (0, validaciones_1.generarCorreoElectronico)(nombres, apellidos);
        const correogenerado = yield correogeneradoPromise;
        console.log(correogenerado);
        //validamos el usuario
        const usuariovalidadoPromise = (0, validaciones_1.validarUsuario)(username);
        const usuariovalidado = yield usuariovalidadoPromise;
        if (usuariovalidado !== 'true') {
            console.log(usuariovalidado);
            return res.status(200).json({ registrodeusuario: usuariovalidado });
        }
        //validamos el password
        const passwordvalidado = (0, validaciones_1.validarPassword)(password);
        if (passwordvalidado !== 'true') {
            console.log(passwordvalidado);
            return res.status(200).json({ registrodeusuario: passwordvalidado });
        }
        //validamos la identificacion
        const identificacionvalidada = (0, validaciones_1.validarIdentificacion)(identificacion);
        if (identificacionvalidada !== 'true') {
            console.log(identificacionvalidada);
            return res.status(200).json({ registrodeusuario: identificacionvalidada });
        }
        //codificamos la contrase;a
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        //enviamos los datos a registrar
        const response = yield database_conection_1.pool.query('select registrarUsuarioEstandar($1, $2, $3, $4, $5, $6, $7)', [username, hashedPassword, correogenerado, nombres, apellidos, identificacion, fechanacimiento]);
        if (response.rows[0].registrarusuarioestandar == false) {
            return res.status(500).json({ message: 'Error al cargar los datos' });
        }
        return res.status(200).json({ registrarusuarioestandar: true });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error...');
    }
});
exports.insertUsers = insertUsers;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const parametrovalidado = (0, validaciones_1.validarParametro)(username);
        if (parametrovalidado == 'email') {
            const response = yield database_conection_1.pool.query('select existemailenusuarios($1)', [username]);
            if (response.rows[0].existemailenusuarios) {
                const response1 = yield database_conection_1.pool.query('select obteneridusuariopormail($1)', [username]);
                const idusuario = response1.rows[0].obteneridusuariopormail;
                //pregunto si el usuario esta bloqueado
                const response2 = yield database_conection_1.pool.query('select verificarUsuarioBloqueado($1)', [idusuario]);
                const verificacion = response2.rows[0].verificarusuariobloqueado;
                if (verificacion) {
                    return res.status(200).json({ login: false, rol: '', message: 'El usuario se encuentra bloqueado' });
                }
                const response = yield database_conection_1.pool.query('select tomarPasswordHashedporelMail($1)', [username]);
                const hashedPasswordfromDB = response.rows[0].tomarpasswordhashedporelmail;
                if (hashedPasswordfromDB == 'false') {
                    return res.status(500).json({ login: 'Existe un error al comparar los datos.' });
                }
                else {
                    const isMatch = yield bcrypt_1.default.compare(password, hashedPasswordfromDB);
                    if (!isMatch) {
                        // se segistran los intentos fallidos del password
                        const response1 = yield database_conection_1.pool.query('select obteneridusuariopormail($1)', [username]);
                        const idusuario = response1.rows[0].obteneridusuariopormail;
                        const response3 = yield database_conection_1.pool.query('select actualizarIntentosSesion($1)', [idusuario]);
                        return res.status(500).json({ login: false, rol: '', message: 'Password incorrecto' });
                    }
                    const fechayhora = (0, validaciones_1.obtenerFechaHoraActual)();
                    const response = yield database_conection_1.pool.query('select obteneridusuariopormail($1)', [username]);
                    const idusuario = response.rows[0].obteneridusuariopormail;
                    const response1 = yield database_conection_1.pool.query('select registrarentrada($1, $2)', [fechayhora, idusuario]);
                    //obtenerRolDeUsuario
                    const response2 = yield database_conection_1.pool.query('select obtenerRolDeUsuario($1)', [idusuario]);
                    const rolusuario = response2.rows[0].obtenerroldeusuario;
                    return res.status(200).json({ login: true, rol: rolusuario, message: 'credenciales correctas' });
                }
            }
            else {
                return res.status(404).json({ login: true, rol: '', message: 'mail incorrecto' });
            }
        }
        const response = yield database_conection_1.pool.query('select userExist($1)', [username]);
        if (response.rows[0].userexist) {
            const response = yield database_conection_1.pool.query('select tomarPasswordHashed($1)', [username]);
            const hashedPasswordfromDB = response.rows[0].tomarpasswordhashed;
            if (hashedPasswordfromDB == 'false') {
                return res.status(404).json({ Login: 'Usuario incorrecto' });
            }
            const isMatch = yield bcrypt_1.default.compare(password, hashedPasswordfromDB);
            console.log(isMatch);
            if (!isMatch) {
                return res.status(404).json({ Login: 'Contraseña Incorrecta' });
            }
            return res.status(201).json({ login: true });
        }
        else {
            return res.status(500).json({ login: 'Usuario incorrecto' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ login: false });
    }
});
exports.Login = Login;
