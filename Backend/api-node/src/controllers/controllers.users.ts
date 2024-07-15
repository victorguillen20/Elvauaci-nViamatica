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

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username } = req.body;
        const response: QueryResult = await pool.query('select*from obtenerDatosPersonaYUsuarioPorUsername($1)',[username]);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error...')
    }
    
}

export const insertUsers = async (req: Request, res: Response): Promise<Response> => {
    const { username, password, nombres, apellidos, identificacion, fechanacimiento } = req.body;
    try {
        //Generamos el correo electronico
        const correogeneradoPromise = generarCorreoElectronico(nombres, apellidos);
        const correogenerado = await correogeneradoPromise;
        console.log(correogenerado);
        
        //validamos el usuario
        const usuariovalidadoPromise = validarUsuario(username);
        const usuariovalidado = await usuariovalidadoPromise;
        if (usuariovalidado !== 'true') {
            console.log(usuariovalidado);
            return res.status(200).json({ registrodeusuario: usuariovalidado});
        }

        //validamos el password
        const passwordvalidado = validarPassword(password);
        if (passwordvalidado !== 'true') {
            console.log(passwordvalidado);
            return res.status(200).json({ registrodeusuario: passwordvalidado});
        }

        //validamos la identificacion
        const identificacionvalidada = validarIdentificacion(identificacion);
        if (identificacionvalidada !== 'true') {
            console.log(identificacionvalidada);
            return res.status(200).json({ registrodeusuario: identificacionvalidada});
        }
        
        //codificamos la contrase;a
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        
        //enviamos los datos a registrar
        const response: QueryResult = await pool.query('select registrarUsuarioEstandar($1, $2, $3, $4, $5, $6, $7)', 
            [username, hashedPassword,  correogenerado, nombres, apellidos, identificacion, fechanacimiento]);
        
        if (response.rows[0].registrarusuarioestandar == false) {
            return  res.status(500).json({ message: 'Error al cargar los datos'});    
        }
        return res.status(200).json({ registrarusuarioestandar: true});               
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error...')
    }   
    
}