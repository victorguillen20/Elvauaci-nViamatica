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
exports.verificarUsuarioBloqueado = verificarUsuarioBloqueado;
exports.verificarExistenciaIdentificacion = verificarExistenciaIdentificacion;
const database_conection_1 = require("../database.conection");
function verificarUsuarioBloqueado(idusuario) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select verificarUsuarioBloqueado($1)`;
            const result = yield client.query(query, [idusuario]);
            const existe = result.rows[0].verificarusuariobloqueado;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
function verificarExistenciaIdentificacion(identificacion) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select verificarExistenciaIdentificacion($1)`;
            const result = yield client.query(query, [identificacion]);
            const existe = result.rows[0].verificarexistenciaidentificacion;
            client.release();
            return existe;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
