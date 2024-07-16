import { pool } from '../database.conection'
import { QueryResult } from 'pg'

export async function verificarUsuarioBloqueado(idusuario: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `select verificarUsuarioBloqueado($1)`;
        const result: QueryResult<{ verificarusuariobloqueado: boolean }> = await client.query(query, [idusuario]);
        const existe = result.rows[0].verificarusuariobloqueado;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}
