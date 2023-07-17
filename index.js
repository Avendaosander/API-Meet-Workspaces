import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import { resolvers } from './graphql/resolvers.js'
import { typeDefs } from './graphql/typeDefs.js'
import { connectDB } from './database/db.js'
connectDB()

const server = new ApolloServer({
   typeDefs,
   resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: process.env.PORT } });

console.log(`🚀 Server listening at: ${url}`);
