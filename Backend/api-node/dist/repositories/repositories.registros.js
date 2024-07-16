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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarsalida = registrarsalida;
exports.registrarentrada = registrarentrada;
exports.registrarUsuarioEstandar = registrarUsuarioEstandar;
exports.registerUsersFromAdmin = registerUsersFromAdmin;
const database_conection_1 = require("../database.conection");
function registrarsalida(fechayhora, idusuario) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select registrarsalida($1, $2)`;
            const result = yield client.query(query, [fechayhora, idusuario]);
            const existe = result.rows[0].registrarsalida;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function registrarentrada(fechayhora, idusuario) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select registrarentrada($1, $2)`;
            const result = yield client.query(query, [fechayhora, idusuario]);
            const existe = result.rows[0].registrarentrada;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function registrarUsuarioEstandar(username, hashedPassword, correogenerado, nombres, apellidos, identificacion, fechanacimiento) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select registrarUsuarioEstandar($1, $2, $3, $4, $5, $6, $7)`;
            const result = yield client.query(query, [username, hashedPassword, correogenerado, nombres, apellidos, identificacion, fechanacimiento]);
            const existe = result.rows[0].registrarusuarioestandar;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function registerUsersFromAdmin(username, password, mail, nombres, apellidos, identificacion, fechanacimiento, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = 'SELECT registrarUsuarioEstandarfromAdmin($1, $2, $3, $4, $5, $6, $7, $8)';
            const result = yield client.query(query, [username, password, mail, nombres, apellidos, identificacion, fechanacimiento, status]);
            const success = result.rows[0].registrarusuarioestandarfromadmin;
            client.release();
            return success;
        }
        catch (error) {
            console.error('Error al registrar el usuario:', error);
            throw error;
        }
    });
}
