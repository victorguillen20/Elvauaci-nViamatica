import { pool } from '../database.conection'
import { QueryResult } from 'pg'


export async function obtenerDatosPersonaYUsuarioPorMail(mail: string): Promise<object> {
    try {
        const client = await pool.connect();
        const query = `select*from obtenerDatosPersonaYUsuarioPorMail($1)`;
        const result: QueryResult = await client.query(query, [mail]);        
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
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

export async function obtenerDatosPersonaYUsuarioPorUsername(username: string): Promise<object> {
    try {
        const client = await pool.connect();
        const query = `select*from obtenerDatosPersonaYUsuarioPorUsername($1)`;
        const result: QueryResult = await client.query(query, [username]);        
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
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

export async function obtenerIdUsuarioPorUsername(username: string): Promise<string> {
    try {
        const client = await pool.connect();
        const query = `select obteneridusuariopormail($1)`;
        const result: QueryResult<{ obteneridusuarioporusername: string }> = await client.query(query, [username]);
        const existe = result.rows[0].obteneridusuarioporusername;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

export async function obtenerRolDeUsuario(idusuario: string): Promise<string> {
    try {
        const client = await pool.connect();
        const query = `select obtenerRolDeUsuario($1)`;
        const result: QueryResult<{ obtenerroldeusuario: string }> = await client.query(query, [idusuario]);
        const existe = result.rows[0].obtenerroldeusuario;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

export async function obteneridusuariopormail(username: string): Promise<string> {
    try {
        const client = await pool.connect();
        const query = `select obteneridusuariopormail($1)`;
        const result: QueryResult<{ obteneridusuariopormail: string }> = await client.query(query, [username]);
        const existe = result.rows[0].obteneridusuariopormail;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}