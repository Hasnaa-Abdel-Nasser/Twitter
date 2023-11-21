import express from 'express';
import pool from './database/dbConnection.js';
import cors from 'cors';
import morgan from 'morgan';
import { AppError } from './src/utils/response.error.js';
import authRouter from './src/modules/user/user.routes.js';
import cookie from 'cookie-parser';
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev')) // request logger middelware
app.use(cookie());
app.use('/api/v1/auth' , authRouter);
app.all('*',(req , res , next)=>{
    next(new AppError('Not Found' , 404));
});
//Global error
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: err.message });
});
  
app.listen(port , ()=>{
    console.log('listening on port ' + port);
});
