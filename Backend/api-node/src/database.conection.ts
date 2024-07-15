import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '1313',
    database: 'dbSesiones',
    port: 5432
})