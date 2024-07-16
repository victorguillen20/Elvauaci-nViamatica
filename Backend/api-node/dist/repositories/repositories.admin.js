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
exports.obtenertodoslosUsuarios = obtenertodoslosUsuarios;
const database_conection_1 = require("../database.conection");
function obtenertodoslosUsuarios() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield database_conection_1.pool.connect();
            const query = `select*from obtenertodoslosUsuarios()`;
            const result = yield client.query(query);
            const rowsWithValues = result.rows.map(row => ({
                idusuario: row.idusuario,
                nombre: row.nombre,
                apellido: row.apellido,
                identificacion: row.identificacion,
                fechanacimiento: row.fechanacimiento,
                username: row.username,
                mail: row.mail,
                status: row.status
            }));
            const responseObject = {
                value: rowsWithValues
            };
            client.release();
            return responseObject;
        }
        catch (error) {
            console.error('Error al obtener el id del usuario:', error);
            throw error;
        }
    });
}
