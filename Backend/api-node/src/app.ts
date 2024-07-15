import express from 'express';
import cors, { CorsOptions } from 'cors';

import indexRoutes from './routes/routes';

const app = express();


const corsOptions: CorsOptions = {
    origin: 'http://localhost:4200', // Permitir solo solicitudes desde este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type'], // Encabezados permitidos
};

//midlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(indexRoutes);
app.listen(4000);
console.log('Server on port', 4000);