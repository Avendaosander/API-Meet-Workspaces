export const typeDefs = `#graphql
   type Query {
      users: [User]
   }
   
   type User {
      _id: ID
      username: String
      email: String
      password: String
   }
`;