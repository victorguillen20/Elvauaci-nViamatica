import { pool } from '../database.conection'
import { QueryResult } from 'pg'


export async function tomarPasswordHashed(username: string): Promise<string> {
    try {
        const client = await pool.connect();
        const query = `select tomarPasswordHashed($1)`;
        const result: QueryResult<{ tomarpasswordhashed: string }> = await client.query(query, [username]);
        const existe = result.rows[0].tomarpasswordhashed;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

export async function userExist(username: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `select userExist($1)`;
        const result: QueryResult<{ userexist: boolean }> = await client.query(query, [username]);
        const existe = result.rows[0].userexist;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}


export async function tomarPasswordHashedporelMail(mail: string): Promise<string> {
    try {
        const client = await pool.connect();
        const query = `select tomarPasswordHashedporelMail($1)`;
        const result: QueryResult<{ tomarpasswordhashedporelmail: string }> = await client.query(query, [mail]);
        const existe = result.rows[0].tomarpasswordhashedporelmail;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

export async function existemailenusuarios(mail: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `select existemailenusuarios($1)`;
        const result: QueryResult<{ existemailenusuarios: boolean }> = await client.query(query, [mail]);
        const existe = result.rows[0].existemailenusuarios;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}
