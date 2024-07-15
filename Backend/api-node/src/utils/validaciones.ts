import { pool } from '../database.conection'
import { QueryResult } from 'pg'

export async function generarCorreoElectronico(nombres: string, apellidos: string): Promise<string> {
    const nombreSeparado = nombres.split(' ');
    const apellidoSeparado = apellidos.split(' ');

    // Tomar la primera letra del primer nombre en minúsculas
    const primeraLetraNombre = nombreSeparado[0].charAt(0).toLowerCase();

    // Tomar el primer apellido en minúsculas y la primera letra del segundo apellido
    const primerApellido = apellidoSeparado[0].toLowerCase();
    const primeraLetraSegundoApellido = (apellidoSeparado.length > 1) ? apellidoSeparado[1].charAt(0).toLowerCase() : '';

    // Generar el correo electrónico concatenando las partes
    let correoGenerado = `${primeraLetraNombre}${primerApellido}${primeraLetraSegundoApellido}@mail.com`;

    // Verificar si el correo ya existe en la base de datos
    const correoExiste = await existeMailEnUsuarios(correoGenerado);
    if (correoExiste) {
        correoGenerado = `${primeraLetraNombre}${primerApellido}${primeraLetraSegundoApellido}1@mail.com`;
    }

    return correoGenerado;
}

// Función para verificar si el correo ya existe en la base de datos
async function existeMailEnUsuarios(mail: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const query = `select existeMailEnUsuarios($1)`;
        const result: QueryResult<{ existeMailEnUsuarios: boolean }> = await client.query(query, [mail]);
        const existe = result.rows[0].existeMailEnUsuarios;
        client.release();
        return existe;
    } catch (error) {
        console.error('Error al verificar si existe el correo en Usuarios:', error);
        throw error;
    }
}


export async function validarUsuario(username: string): Promise<string> {
    let message = 'false';
    // Validar la longitud mínima y máxima
    if (username.length < 8 || username.length > 20) {
        message = 'El username debe de tener mínimo 8 dígitos y máximo 20';
        return message;
    }

    // Validar que no contenga signos
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        message = 'El username no debe de contener caracteres especiales';
        return message;
    }

    // Validar que contenga al menos un número
    if (!/\d/.test(username)) {
        return  message = 'El username al menos debe de tener un número';
    }

    // Validar que contenga al menos una letra mayúscula
    if (!/[A-Z]/.test(username)) {
        return message = 'El username al menos debe de contener una letra mayúscula';
    }

    // Verificar si el usuario ya existe en la base de datos
    const usuarioExiste = await userExist(username);
    if (usuarioExiste) {
        return message = 'El usuario ya existe en la base de datos';
    }

    // Si pasa todas las validaciones, retornar true
    return 'true';
}

// Función para verificar si el usuario ya existe en la base de datos
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
    // Validar longitud mínima
    if (password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres.';
    }

    // Validar al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
        return 'La contraseña debe contener al menos una letra mayúscula.';
    }

    // Validar que no contenga espacios
    if (/\s/.test(password)) {
        return 'La contraseña no debe contener espacios.';
    }

    // Validar al menos un signo
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'La contraseña debe contener al menos un signo.';
    }

    // Si pasa todas las validaciones, retornar true
    return 'true';
}

export function validarIdentificacion(identificacion: string): string {
    // Validar longitud exacta de 10 dígitos
    if (identificacion.length !== 10) {
        return 'La identificación debe tener exactamente 10 dígitos.';
    }

    // Validar que sean solo números
    if (!/^\d+$/.test(identificacion)) {
        return 'La identificación debe contener solo números.';
    }

    // Validar que no haya 4 números seguidos iguales
    if (/(\d)\1{3}/.test(identificacion)) {
        return 'La identificación no puede tener 4 dígitos consecutivos iguales.';
    }

    // Si pasa todas las validaciones, retornar true
    return 'true';
}

export const validarParametro = (parametro: string): 'email' | 'username' => {
    // Expresión regular para validar correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;    

    // Verificar si el parámetro coincide con el formato de correo electrónico
    if (emailRegex.test(parametro)) {
        return 'email';
    } else {
        return 'username';
    }
}

export function obtenerFechaHoraActual(): string {
    const fechaHoraActual = new Date();
    const year = fechaHoraActual.getFullYear();
    const month = ('0' + (fechaHoraActual.getMonth() + 1)).slice(-2); // Los meses van de 0 a 11, por eso se suma 1 y se formatea con dos dígitos
    const day = ('0' + fechaHoraActual.getDate()).slice(-2); // Formatea el día con dos dígitos
    const hours = ('0' + fechaHoraActual.getHours()).slice(-2); // Formatea las horas con dos dígitos
    const minutes = ('0' + fechaHoraActual.getMinutes()).slice(-2); // Formatea los minutos con dos dígitos
    const seconds = ('0' + fechaHoraActual.getSeconds()).slice(-2); // Formatea los segundos con dos dígitos

    // Formatea la fecha y hora en el formato 'YYYY-MM-DD HH:MI:SS'
    const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    
    return formattedDateTime;
}