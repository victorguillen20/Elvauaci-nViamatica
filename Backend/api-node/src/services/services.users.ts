import {Request, Response} from 'express'
import { pool } from '../database.conection'
import { QueryResult } from 'pg'
import bcryptjs from 'bcrypt'

import { existemailenusuarios, tomarPasswordHashed, tomarPasswordHashedporelMail, userExist } from '../repositories/repositories.users';
import { verificarExistenciaIdentificacion, verificarUsuarioBloqueado } from '../repositories/repositories.users.verificaciones';
import { generarCorreoElectronico, obtenerFechaHoraActual, validarIdentificacion, validarParametro, validarPassword, validarUsuario } from '../utils/validaciones';
import { obtenertodoslosUsuarios } from '../repositories/repositories.admin';
import { obtenerDatosPersonaYUsuarioPorMail, obtenerDatosPersonaYUsuarioPorUsername, obteneridusuariopormail, obtenerIdUsuarioPorUsername, obtenerRolDeUsuario } from '../repositories/repositories.obtener.users';
import { registrarentrada, registrarsalida, registrarUsuarioEstandar } from '../repositories/repositories.registros';
import { actualizarIntentosSesion, actualizarUsuarios, resetearIntentos } from '../repositories/repositories.actualizar.users';

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {        
        const response = await obtenertodoslosUsuarios();       
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error...')
    }   
    
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username } = req.body;
        const parametrovalidado = validarParametro(username);        
        if (parametrovalidado == 'email') {
            const response = await obtenerDatosPersonaYUsuarioPorMail(username);
            return res.status(200).json(response);           
        }        
        const response = await obtenerDatosPersonaYUsuarioPorUsername(username);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server error...')
    }
    
}

export const insertUsers = async (req: Request, res: Response): Promise<Response> => {
    const { username, password, nombres, apellidos, identificacion, fechanacimiento } = req.body;
    try {        
        const verificacion = await verificarExistenciaIdentificacion(identificacion);
        if (verificacion) {
            return res.status(500).json({ registrodeusuario: 'Ya existe una cuenta con estos datos'});
        }
        const usuariovalidadoPromise = validarUsuario(username);
        const usuariovalidado = await usuariovalidadoPromise;
        if (usuariovalidado !== 'true') {
            console.log(usuariovalidado);
            return res.status(200).json({ registrodeusuario: usuariovalidado});
        }
        
        const passwordvalidado = validarPassword(password);
        if (passwordvalidado !== 'true') {
            console.log(passwordvalidado);
            return res.status(200).json({ registrodeusuario: passwordvalidado});
        }
        
        const identificacionvalidada = validarIdentificacion(identificacion);
        if (identificacionvalidada !== 'true') {
            console.log(identificacionvalidada);
            return res.status(200).json({ registrodeusuario: identificacionvalidada});
        }
                
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const correogenerado = await generarCorreoElectronico(nombres, apellidos);
        
        console.log(correogenerado);
                
        const response = await registrarUsuarioEstandar(
            username, hashedPassword,  correogenerado, nombres, apellidos, identificacion, fechanacimiento);
            console.log(correogenerado);
        if (response == false) {
            return  res.status(500).json({ message: 'Error al cargar los datos'});    
        }
        return res.status(200).json({ registrodeusuario: true});               
    } catch (error) {
        console.log(error);
        return res.status(500).json({ registrodeusuario: false})
    }   
    
}

export const updateUsers = async (req: Request, res: Response): Promise<Response> => {
    const { username, password, nombres, apellidos, identificacion, fechanacimiento } = req.body;
    try {         
        const usuariovalidadoPromise = validarUsuario(username);
        const usuariovalidado = await usuariovalidadoPromise;
        if (usuariovalidado !== 'true') {
            console.log(usuariovalidado);
            return res.status(200).json({ registrodeusuario: usuariovalidado});
        }
        
        const passwordvalidado = validarPassword(password);
        if (passwordvalidado !== 'true') {
            console.log(passwordvalidado);
            return res.status(200).json({ registrodeusuario: passwordvalidado});
        }
        
        const identificacionvalidada = validarIdentificacion(identificacion);
        if (identificacionvalidada !== 'true') {
            console.log(identificacionvalidada);
            return res.status(200).json({ registrodeusuario: identificacionvalidada});
        }
        const idusuario = await obtenerIdUsuarioPorUsername(username);            
        
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const response = await actualizarUsuarios(idusuario, username, hashedPassword, nombres, apellidos, identificacion, fechanacimiento);
        
        if (response == false) {
            return  res.status(500).json({ updateusers: false, message: 'Error al cargar los datos'});    
        }
        return res.status(200).json({ updateusers: true, message: 'Datos actualizados'});               
    } catch (error) {
        console.log(error);
        return res.status(500).json({updateusers: false, message: 'Error al actualizar los datos'})
    }   
    
}

export const Login = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;
    try {
        const parametrovalidado = validarParametro(username);        
        if (parametrovalidado == 'email') {
            const response = await existemailenusuarios(username);            
            if (response) {
                const idusuario = await obteneridusuariopormail(username);                        
                const verificacion = await verificarUsuarioBloqueado(idusuario);
                
                if (verificacion) {
                    return res.status(200).json({login: false, rol: '', message: 'El usuario se encuentra bloqueado'});
                }
                const hashedPasswordfromDB = await tomarPasswordHashedporelMail(username);                
                if (hashedPasswordfromDB == 'false') {
                    return res.status(500).json({ login: false, rol: '', message:'Existe un error al comparar los datos.' });
                } else {                    
                    const isMatch = await bcryptjs.compare(password, hashedPasswordfromDB);                    
                    if (!isMatch) {                        
                        const idusuario = await obteneridusuariopormail(username);                        
                        await actualizarIntentosSesion(idusuario);
                        return res.status(500).json({ login: false, rol: '', message: 'Password incorrecto'});
                    }
                    const fechayhora = obtenerFechaHoraActual();
                    const idusuario = await obteneridusuariopormail(username);
                    
                    await registrarentrada(fechayhora, idusuario); 
                    const rolusuario = await obtenerRolDeUsuario(idusuario);                   
                    return res.status(200).json({login: true, rol: rolusuario, message: 'credenciales correctas'});
                }
            } else {
                return res.status(404).json({ login: true, rol: '', message: 'credenciales incorrectas'});
            }
        }        
        
        const response = await userExist(username);
        
        if (response) {            
            const idusuario = await obtenerIdUsuarioPorUsername(username);           
            const verificacion = await verificarUsuarioBloqueado(idusuario);
            
            if (verificacion) {
                return res.status(200).json({login: false, rol: '', message: 'El usuario se encuentra bloqueado'});
            }

            const hashedPasswordfromDB = await tomarPasswordHashed(username);                        
            if ( hashedPasswordfromDB == 'false') {
                return res.status(404).json({ login: false, rol: '', message: 'Credenciales incorrectas'});
            }
            const isMatch = await bcryptjs.compare(password, hashedPasswordfromDB);
            if (!isMatch) {
                const idusuario = await obteneridusuariopormail(username);                
                await actualizarIntentosSesion(idusuario);
                return res.status(404).json({ login: false, rol: '', message: 'Credenciales incorrectas'});
            }
            
            const fechayhora = obtenerFechaHoraActual();
            await registrarentrada(fechayhora, idusuario);            
            const rolusuario = await obtenerRolDeUsuario(idusuario);            
            return res.status(201).json({ login: true, rol: rolusuario, message: 'Login exitoso' });
        } else {
            return res.status(500).json({ login: false, rol: '', message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ login: false });
    }
}

export const logOut = async (req: Request, res: Response): Promise<Response> => {
    const { username } = req.body;
    try {
        const parametrovalidado = validarParametro(username);        
        if (parametrovalidado == 'email') {
            const idusuario = await obteneridusuariopormail(username);            
            const fechayhora = obtenerFechaHoraActual();
            await registrarsalida(fechayhora, idusuario);
            await resetearIntentos(idusuario);
            return res.status(200).json({logout: true});   
            
        }         
        const idusuario = await obtenerIdUsuarioPorUsername(username);        
        const fechayhora = obtenerFechaHoraActual();        
        await resetearIntentos(idusuario);
        await  registrarsalida(fechayhora, idusuario);
        return res.status(200).json({logout: true});       
        
    } catch (error) {
        console.log(error);
        return res.status(200).json({logout: false});
    }    
}