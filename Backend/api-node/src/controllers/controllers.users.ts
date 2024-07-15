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

export const Login = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;
    try {
        const parametrovalidado = validarParametro(username);        
        if (parametrovalidado == 'email') {
            const response: QueryResult = await pool.query('select existemailenusuarios($1)',[username]);            
            if (response.rows[0].existemailenusuarios) {
                const response1: QueryResult = await pool.query('select obteneridusuariopormail($1)', [username]);
                const idusuario = response1.rows[0].obteneridusuariopormail;
                //pregunto si el usuario esta bloqueado
                const response2: QueryResult = await pool.query('select verificarUsuarioBloqueado($1)', [idusuario]);
                const verificacion = response2.rows[0].verificarusuariobloqueado;
                if (verificacion) {
                    return res.status(200).json({login: false, rol: '', message: 'El usuario se encuentra bloqueado'});
                }
                const response: QueryResult = await pool.query('select tomarPasswordHashedporelMail($1)', [username]);
                const hashedPasswordfromDB = response.rows[0].tomarpasswordhashedporelmail;
                if (hashedPasswordfromDB == 'false') {
                    return res.status(500).json({ login: 'Existe un error al comparar los datos.' });
                } else {                    
                    const isMatch = await bcryptjs.compare(password, hashedPasswordfromDB);                    
                    if (!isMatch) {
                        // se segistran los intentos fallidos del password
                        const response1: QueryResult = await pool.query('select obteneridusuariopormail($1)', [username]);
                        const idusuario = response1.rows[0].obteneridusuariopormail;
                        const response3: QueryResult = await pool.query('select actualizarIntentosSesion($1)', [idusuario]);
                        return res.status(500).json({ login: false, rol: '', message: 'Password incorrecto'});
                    }
                    const fechayhora = obtenerFechaHoraActual();
                    const response: QueryResult = await pool.query('select obteneridusuariopormail($1)', [username]);
                    const idusuario = response.rows[0].obteneridusuariopormail;
                    
                    const response1: QueryResult = await pool.query('select registrarentrada($1, $2)', [fechayhora, idusuario]); 
                    //obtenerRolDeUsuario
                    const response2: QueryResult = await pool.query('select obtenerRolDeUsuario($1)', [idusuario]);
                    const rolusuario = response2.rows[0].obtenerroldeusuario;
                    
                    return res.status(200).json({login: true, rol: rolusuario, message: 'credenciales correctas'});
                }
            } else {
                return res.status(404).json({ login: true, rol: '', message: 'mail incorrecto'});
            }
        }        const response: QueryResult = await pool.query('select userExist($1)', [username]);
        
        if (response.rows[0].userexist) {            
            const response: QueryResult = await pool.query('select tomarPasswordHashed($1)', [username]);
            const hashedPasswordfromDB = response.rows[0].tomarpasswordhashed;            
            if ( hashedPasswordfromDB == 'false') {
                return res.status(404).json({ Login: 'Usuario incorrecto'});
            }
            const isMatch = await bcryptjs.compare(password, hashedPasswordfromDB);
            console.log(isMatch);
            if (!isMatch) {
                return res.status(404).json({ Login: 'Contraseña Incorrecta'});
            }
            return res.status(201).json({ login: true });
        } else {
            return res.status(500).json({ login: 'Usuario incorrecto' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ login: false });
    }
}