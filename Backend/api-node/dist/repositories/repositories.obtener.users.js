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
exports.obtenerDatosPersonaYUsuarioPorMail = obtenerDatosPersonaYUsuarioPorMail;
exports.obtenerDatosPersonaYUsuarioPorUsername = obtenerDatosPersonaYUsuarioPorUsername;
exports.obtenerIdUsuarioPorUsername = obtenerIdUsuarioPorUsername;
exports.obtenerRolDeUsuario = obtenerRolDeUsuario;
exports.obteneridusuariopormail = obteneridusuariopormail;
const database_conection_1 = require("../database.conection");
function obtenerDatosPersonaYUsuarioPorMail(mail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select*from obtenerDatosPersonaYUsuarioPorMail($1)`;
            const result = yield client.query(query, [mail]);
            const rowsWithValues = result.rows.map(row => ({
                nombre: row.nombre,
                apellido: row.apellido,
                identificacion: row.identificacion,
                fechanacimiento: row.fechanacimiento,
                username: row.username,
                mail: row.mail
            }));
            client.release();
            return rowsWithValues;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function obtenerDatosPersonaYUsuarioPorUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select*from obtenerDatosPersonaYUsuarioPorUsername($1)`;
            const result = yield client.query(query, [username]);
            const rowsWithValues = result.rows.map(row => ({
                nombre: row.nombre,
                apellido: row.apellido,
                identificacion: row.identificacion,
                fechanacimiento: row.fechanacimiento,
                username: row.username,
                mail: row.mail
            }));
            client.release();
            return rowsWithValues;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function obtenerIdUsuarioPorUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select obteneridusuariopormail($1)`;
            const result = yield client.query(query, [username]);
            const existe = result.rows[0].obteneridusuarioporusername;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function obtenerRolDeUsuario(idusuario) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select obtenerRolDeUsuario($1)`;
            const result = yield client.query(query, [idusuario]);
            const existe = result.rows[0].obtenerroldeusuario;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function obteneridusuariopormail(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select obteneridusuariopormail($1)`;
            const result = yield client.query(query, [username]);
            const existe = result.rows[0].obteneridusuariopormail;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
