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
exports.tomarPasswordHashed = tomarPasswordHashed;
exports.userExist = userExist;
exports.tomarPasswordHashedporelMail = tomarPasswordHashedporelMail;
exports.existemailenusuarios = existemailenusuarios;
const database_conection_1 = require("../database.conection");
function tomarPasswordHashed(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select tomarPasswordHashed($1)`;
            const result = yield client.query(query, [username]);
            const existe = result.rows[0].tomarpasswordhashed;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function userExist(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select userExist($1)`;
            const result = yield client.query(query, [username]);
            const existe = result.rows[0].userexist;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function tomarPasswordHashedporelMail(mail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select tomarPasswordHashedporelMail($1)`;
            const result = yield client.query(query, [mail]);
            const existe = result.rows[0].tomarpasswordhashedporelmail;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function existemailenusuarios(mail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select existemailenusuarios($1)`;
            const result = yield client.query(query, [mail]);
            const existe = result.rows[0].existemailenusuarios;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
