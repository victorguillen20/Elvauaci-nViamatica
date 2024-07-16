import { pool } from '../database.conection'
import { QueryResult } from 'pg'

export async function registrarsalida(fechayhora: string, idusuario: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `select registrarsalida($1, $2)`;
        const result: QueryResult<{ registrarsalida: boolean }> = await client.query(query, [fechayhora, idusuario]);
        const existe = result.rows[0].registrarsalida;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

export async function registrarentrada(fechayhora: string, idusuario: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `select registrarentrada($1, $2)`;
        const result: QueryResult<{ registrarentrada: boolean }> = await client.query(query, [fechayhora, idusuario]);
        const existe = result.rows[0].registrarentrada;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

export async function registrarUsuarioEstandar(
    username: string, hashedPassword: string,  correogenerado: string, nombres: string, 
    apellidos: string, identificacion: string, fechanacimiento: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `select registrarUsuarioEstandar($1, $2, $3, $4, $5, $6, $7)`;
        const result: QueryResult<{ registrarusuarioestandar: boolean }> = await client.query(query, 
            [username, hashedPassword,  correogenerado, nombres, apellidos, identificacion, fechanacimiento]);
        const existe = result.rows[0].registrarusuarioestandar;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}