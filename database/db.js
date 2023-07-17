import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false)

export const connectDB = () => {
   mongoose.connect(process.env.URI) 
      .then(async()=> {
         console.log('DB Conectada🚀')
      })
      .catch((e) => console.log("Fallo de Conexion " + e));
}