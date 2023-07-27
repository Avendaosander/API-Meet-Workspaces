import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Users from '../models/Users.js';
import addAdmin from './dbAdmin.js';
dotenv.config();

mongoose.set('strictQuery', false)

export const connectDB = () => {
   mongoose.connect(process.env.URI) 
      .then(async()=> {
         const admin = await Users.findOne({email: process.env.ADMIN_EMAIL}).lean();
         if (!admin) {
            addAdmin()
            console.log('Administrador Creado');
         }
         console.log('DB Conectada🚀')
      })
      .catch((e) => console.log("Fallo de Conexion " + e));
}