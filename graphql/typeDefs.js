export const typeDefs = `#graphql
   type Query {
      getUsers: [User]
      getWorkspace(_id: ID!): WorkspaceWithComments
      getWorkspaces: [Workspace]
      getReservations: [Reservation]
   }

   type Mutation {
      login(username: String!, password: String!): ResponseAuth
      register(username: String!, email: String!, password: String!): ResponseAuth
      updateUser(_id: ID!, username: String, email: String, password: String rol: String): User
      deleteUser(_id: ID!): ResponseID
      createWorkspace(title: String!, capacity: Int!, description: String!, address: String!, lat: String!, lon: String!, weekdays: [String]!, from: String!, to: String! price: Int! ): Workspace
      updateWorkspace(_id: ID!, title: String, capacity: Int, description: String, address: String, lat: String, lon: String, weekdays: [String], from: String, to: String price: Int ): Workspace
      deleteWorkspace(_id: ID!): ResponseID
      createReservation(workspace: ID!, date: String!, hour: String!, price: Int!, duration: String! ): Reservation
      deleteReservation(_id: ID!): ResponseID
      createComment(workspace: ID!, content: String!): Comment
      deleteComment(_id: ID!): ResponseID
   }

   type User {
      _id: ID
      username: String
      email: String
      password: String
      rol: String
   }
   
   type WorkspaceWithComments {
      workspace: Workspace
      comments: [Comment]
   }

   type Workspace {
      _id: ID
      title: String
      capacity: Int
      description: String
      address: String
      lat: String
      lon: String
      price: Int
      from: String
      to: String
      weekdays: [String]
   }

   type Reservation {
      _id: ID
      user: UserPopulate
      workspace: WorkspacePopulate
      date: String
      hour: String
      price: Int
      duration: String
   }

   type Comment {
      _id: ID
      user: UserPopulate
      workspace: ID
      content: String
      createdAt: String
      updatedAt: String
   }
   
   type UserPopulate {
      _id: ID
      username: String
   }

   type WorkspacePopulate {
      _id: ID
      title: String
      address: String
      price: Int
   }
   
   type ResponseAuth {
      token: String
      username: String
      email: String
      rol: String
   }

   type ResponseID {
      _id: ID
   }
`;