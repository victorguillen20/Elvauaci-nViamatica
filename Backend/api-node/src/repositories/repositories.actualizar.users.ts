import { pool } from '../database.conection'
import { QueryResult } from 'pg'

export async function actualizarIntentosSesion(idusuario: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `select actualizarintentossesion($1)`;
        const result: QueryResult<{ actualizarintentossesion: boolean }> = await client.query(query, [idusuario]);
        const existe = result.rows[0].actualizarintentossesion;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

export async function actualizarUsuarios(
    idusuario: string, username: string, hashedPassword: string, nombres: string, 
    apellidos: string, identificacion: string, fechanacimiento: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `select actualizarUsuarios($1, $2, $3, $4, $5, $6, $7)`;
        const result: QueryResult<{ actualizarusuarios: boolean }> = await client.query(query, [idusuario, username, hashedPassword, nombres, apellidos, identificacion, fechanacimiento]);
        const existe = result.rows[0].actualizarusuarios;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

export async function resetearIntentos(idusuario: string): Promise<void> {
    try {
        const client = await pool.connect();
        const query = `select resetearIntentos($1)`;
        const result: QueryResult<{ resetearintentos: boolean }> = await client.query(query, [idusuario]);        
        client.release();        
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

