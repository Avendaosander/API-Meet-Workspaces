import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import { resolvers } from './graphql/resolvers.js'
import { typeDefs } from './graphql/typeDefs.js'
import Users from './models/Users.js'
import jwt from 'jsonwebtoken'
import { connectDB } from './database/db.js'
connectDB()

const server = new ApolloServer({
   typeDefs,
   resolvers,
   csrfPrevention: false,
   formatError: (error) => {
     // Registro del error en la consola o archivo de registro (log file)
     console.error('Error en Apollo Server:', error);
     return error;
   },
});

const { url } = await startStandaloneServer(server, {
   context: async ({ req }) => {
      const { authorization } = req.headers;
      
      if (authorization) {
         const decoded = jwt.verify(authorization, process.env.SECRETTK)
         
         const user = await Users.findById(decoded.id).lean()
         const isAdmin = user.rol === 'Admin'

         // Add the user to the context
         return { auth: true, isAdmin, user };
      }
      return { auth: false, isAdmin: false }
   },
   listen: { port: process.env.PORT } 
});

console.log(`🚀 Server listening at: ${url}`);
