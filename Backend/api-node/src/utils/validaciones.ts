import { pool } from '../database.conection'
import { QueryResult } from 'pg'

export async function generarCorreoElectronico(nombres: string, apellidos: string): Promise<string> {
    const nombreSeparado = nombres.split(' ');
    const apellidoSeparado = apellidos.split(' ');

    const primeraLetraNombre = nombreSeparado[0].charAt(0).toLowerCase();
   
    const primerApellido = apellidoSeparado[0].toLowerCase();
    const primeraLetraSegundoApellido = (apellidoSeparado.length > 1) ? apellidoSeparado[1].charAt(0).toLowerCase() : '';
    
    let correoGenerado = `${primeraLetraNombre}${primerApellido}${primeraLetraSegundoApellido}@mail.com`;
    let contador = 1;

    while (await existeMailEnUsuarios(correoGenerado)) {
        correoGenerado = `${primeraLetraNombre}${primerApellido}${primeraLetraSegundoApellido}${contador}@mail.com`;
        contador++;
    }

    return correoGenerado;
}

async function existeMailEnUsuarios(mail: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `SELECT EXISTS (SELECT 1 FROM usuarios WHERE mail = $1)`;
        const result: QueryResult<{ exists: boolean }> = await client.query(query, [mail]);
        const existe = result.rows[0].exists;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al verificar si existe el correo en Usuarios:', error);
        throw error;
    }
}


export async function validarUsuario(username: string): Promise<string> {
    let message = 'false';
    
    if (username.length < 8 || username.length > 20) {
        message = 'El username debe de tener mínimo 8 dígitos y máximo 20';
        return message;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        message = 'El username no debe de contener caracteres especiales';
        return message;
    }
    
    if (!/\d/.test(username)) {
        return  message = 'El username al menos debe de tener un número';
    }

    if (!/[A-Z]/.test(username)) {
        return message = 'El username al menos debe de contener una letra mayúscula';
    }

    const usuarioExiste = await userExist(username);
    if (usuarioExiste) {
        return message = 'El usuario ya existe en la base de datos';
    }

    return 'true';
}

async function userExist(username: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `SELECT userExist($1) AS existe`;
        const result: QueryResult<{ existe: boolean }> = await client.query(query, [username]);
        const existe = result.rows[0].existe;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al verificar si existe el usuario en la base de datos:', error);
        throw error;
    }
}

export function validarPassword(password: string): string {
    
    if (password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!/[A-Z]/.test(password)) {
        return 'La contraseña debe contener al menos una letra mayúscula.';
    }
    if (/\s/.test(password)) {
        return 'La contraseña no debe contener espacios.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'La contraseña debe contener al menos un signo.';
    }
    return 'true';
}

export function validarIdentificacion(identificacion: string): string {    
    if (identificacion.length !== 10) {
        return 'La identificación debe tener exactamente 10 dígitos.';
    }
    
    if (!/^\d+$/.test(identificacion)) {
        return 'La identificación debe contener solo números.';
    }
    
    if (/(\d)\1{3}/.test(identificacion)) {
        return 'La identificación no puede tener 4 dígitos consecutivos iguales.';
    }
    
    return 'true';
}

export const validarParametro = (parametro: string): 'email' | 'username' => {    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;    
    
    if (emailRegex.test(parametro)) {
        return 'email';
    } else {
        return 'username';
    }
}

export function obtenerFechaHoraActual(): string {
    const fechaHoraActual = new Date();
    const year = fechaHoraActual.getFullYear();
    const month = ('0' + (fechaHoraActual.getMonth() + 1)).slice(-2);
    const day = ('0' + fechaHoraActual.getDate()).slice(-2);
    const hours = ('0' + fechaHoraActual.getHours()).slice(-2);
    const minutes = ('0' + fechaHoraActual.getMinutes()).slice(-2);
    const seconds = ('0' + fechaHoraActual.getSeconds()).slice(-2);
    const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    
    return formattedDateTime;
}