import { pool } from '../database.conection'
import { QueryResult } from 'pg'

export async function obtenertodoslosUsuarios(): Promise<object> {
    try {
        const client = await pool.connect();
        const query = `select*from obtenertodoslosUsuarios()`;
        const result: QueryResult = await client.query(query);        
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
        }
        client.release();
        return responseObject;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}