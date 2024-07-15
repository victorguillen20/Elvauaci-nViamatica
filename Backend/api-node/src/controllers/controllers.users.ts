import {Request, Response} from 'express'
import { pool } from '../database.conection'
import { QueryResult } from 'pg'
import bcryptjs from 'bcrypt'

import { generarCorreoElectronico, obtenerFechaHoraActual, validarIdentificacion, validarParametro, validarPassword, validarUsuario } from '../utils/validaciones';

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {        
        const response: QueryResult = await pool.query('select*from obtenertodoslosUsuarios()');
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error...')
    }
    
}