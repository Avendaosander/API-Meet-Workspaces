import Users from '../models/Users.js';
import dotenv from 'dotenv';
dotenv.config();

function addAdmin() {
   Users.insertMany([
      {
         "_id": `${process.env.ADMIN_ID}`,
         "username": `${process.env.ADMIN_USERNAME}`,
         "email": `${process.env.ADMIN_EMAIL}`,
         "password": `${process.env.ADMIN_PASSWORD}`,
         "rol": "Admin"
      }
   ]);
}

export default addAdmin