import {Request, Response} from 'express'
import { pool } from '../database.conection'
import { QueryResult } from 'pg'
import bcryptjs from 'bcrypt'

import { generarCorreoElectronico, obtenerFechaHoraActual, validarIdentificacion, validarParametro, validarPassword, validarUsuario } from '../utils/validaciones';