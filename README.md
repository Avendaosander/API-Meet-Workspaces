<div align="center">

<a href="https://github.com/Avendaosander/API-Meet-Workspaces">
  <img alt="Universidad Valle del Momboy" src="https://res.cloudinary.com/dcssovtbt/image/upload/v1689434853/Logos/Logo-Meet.png" width="180" />
</a>

# **Meet Workspaces**

🔵Este es el servidor oficial para la plataforma de reservas **Meet Workspaces**, desarrollado con GraphQL y Apollo-Server🔵

[![](https://res.cloudinary.com/dtjgc9qlk/image/upload/c_scale,w_150,r_max/v1681759279/Eventos%20UVM/Nodejs_f1rqqz.webp)](https://nodejs.org/docs/latest-v19.x/api/)
[![](https://res.cloudinary.com/dtjgc9qlk/image/upload/w_150/v1686780701/Logos/GraphQL_hm0rd8.png)](https://graphql.org/code/#javascript)
[![](https://res.cloudinary.com/dtjgc9qlk/image/upload/w_150/v1686780782/Logos/Apollo-server_w3akvq.png)](https://www.apollographql.com/docs/apollo-server/)
[![](https://res.cloudinary.com/dtjgc9qlk/image/upload/c_scale,w_150,r_max/v1681759279/Eventos%20UVM/MongoDB_r13ajm.png)](https://www.mongodb.com/docs/manual/)
</div>


## **Tabla de Contenidos** 📌
***
- [**Meet Workspaces**](#meet-workspaces)
  - [**Tabla de Contenidos** 📌](#tabla-de-contenidos-)
  - [**Instalación** 🔧](#instalación-)
  - [**Ejecutando las pruebas** ⚙️](#ejecutando-las-pruebas-️)
        - [*NOTA*](#nota)
    - [⚛️**Querys**](#️querys)
      - [🛡️**GetWorkspaces**](#️getworkspaces)
      - [🛡️**GetWorkspace**](#️getworkspace)
      - [🛡️**GetReservations**](#️getreservations)
      - [🛡️**GetUsers**](#️getusers)
    - [⚛️**Mutations**](#️mutations)
      - [⚛️**Login**](#️login)
      - [⚛️**Register**](#️register)
      - [🛡️**UpdateUser**](#️updateuser)
      - [🛡️**DeleteUser**](#️deleteuser)
      - [🛡️**CreateWorkspace**](#️createworkspace)
      - [🛡️**UpdateWorkspace**](#️updateworkspace)
      - [🛡️**DeleteUser**](#️deleteuser-1)
      - [🛡️**CreateReservation**](#️createreservation)
      - [🛡️**DeleteReservation**](#️deletereservation)
      - [🛡️**CreateComment**](#️createcomment)
      - [🛡️**DeleteComment**](#️deletecomment)
  - [**Construido con** 🛠️](#construido-con-️)
  - [**Desarrolladores** ✒️](#desarrolladores-️)


## **Instalación** 🔧
Lo primero es clonar el repositorio con el comando:
```
git clone https://github.com/Avendaosander/API-Meet-Workspaces.git
```
Luego debe crear un archivo `.env` en la ruta raiz del proyecto `/`. El contenido de este archivo `.env` le será enviado.
***
Una vez creado el archivo `.env`, abrir la terminal en la ruta raiz del proyecto y ejecutar el siguiente comando:
```
npm install
```
Iniciar el servidor ejecutando el comando:
```
npm run dev
```
Debe aparecer lo siguiente:
```
🚀 Server listening at: http://localhost:4001/
DB Conectada🚀
```
Significa que el servidor ha arrancado correctamente.

## **Ejecutando las pruebas** ⚙️
Iniciar el servidor desde la ruta raiz del proyecto "/", una vez inciado el servidor puede ir a la siguiente ruta para utilizar la API con el playground:
```
http://localhost:4001/
```

##### *NOTA*
***
* Todas la Querys y Mutations que lleven al principio el icono 🛡️, Siginifica que es una ruta protegida y requiere  que la peticion contenga un header similar al siguente:
> authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2FjMWVlZmUxYjkyMTNjMTFlMjdhZiIsImlhdCI6MTY4MTc0NDEyNCwiZXhwIjoxNjgyMzQ4OTI0fQ.gud6ljUwI0861hoEVifkvwkMse4v8yeiHWyVaxGMbp0'


### ⚛️**Querys**
***

#### 🛡️**GetWorkspaces** 
Puede probar el Modelo usando GraphQL Playground (Query)

Esta query mostrará todos los workspaces disponibles.
```
query GetWorkspaces {
  getWorkspaces {
    _id
    title
    capacity
    description
    address
    lat
    lon
    weekdays
    from
    to
    price
  }
}
```
#### 🛡️**GetWorkspace** 
Puede probar el Modelo usando GraphQL Playground (Query)

Esta query mostrará un workspace seleccionado según ID.
```
query GetWorkspace($id: ID!) {
  getWorkspace(_id: $id) {
    workspace {
      _id
      title
      capacity
      description
      address
      lat
      lon
      weekdays
      from
      to
    }
    comments {
      _id
      user {
        _id
        username
      }
      workspace
      content
      createdAt
      updatedAt
    }
  }
}
```
#### 🛡️**GetReservations** 
Puede probar el Modelo usando GraphQL Playground (Query)

Esta query mostrará todas las reservaciones disponibles del usuario, o en caso de ser administrador mostrara todas las reservaciones disponibles de la plataforma.
```
query GetReservations {
  getReservations {
    _id
    user {
      _id
      username
    }
    workspace {
      _id
      title
      address
    }
    date
    hour
    duration
    price
  }
}
```
#### 🛡️**GetUsers** 
Puede probar el Modelo usando GraphQL Playground (Query)

Esta query mostrará todos los usuarios disponibles.
```
query GetUsers{
  getUsers {
    _id
    username,
    email,
    password,
    rol
  }
}
```
### ⚛️**Mutations**
***

#### ⚛️**Login** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación le permite a un usuario iniciar sesión.

```
mutation Login($username: String!, $password: String!){
  login(username: $username, password: $password) {
    token
    username
    email
    rol
  }
}
```

#### ⚛️**Register** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación le permite a un nuevo usuario registrarse.

```
mutation Register($username: String!, $email: String!, $password: String!){
  register(username: $username, email: $email, password: $password) {
    token
    username
    email
    rol
  }
}
```

#### 🛡️**UpdateUser** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación permite modificar los datos de un usuario (incluyendo su rol).

```
mutation UpdateUser($id: ID!, $username: String, $email: String, $password: String, $rol: String) {
  updateUser(_id: $id, username: $username, email: $email, password: $password, rol: $rol) {
    _id
    username
    email
    password
    rol
  }
}
```

#### 🛡️**DeleteUser** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación elimina un usuario.

```
mutation DeleteUser($id: ID!) {
  deleteUser(_id: $id) {
    _id
  }
}
```

#### 🛡️**CreateWorkspace** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación permite crear un Workspace.

```
mutation CreateWorkspace($title: String!, $capacity: Int!, $description: String!, $address: String!, $lat: String!, $lon: String!, $weekdays: [String]!, $from: String!, $to: String!, $price: Int!) {
  createWorkspace(title: $title, capacity: $capacity, description: $description, address: $address, lat: $lat, lon: $lon, weekdays: $weekdays, from: $from, to: $to, price: $price) {
    _id
    title
    description
    address
    lat
    lon
    capacity
    price
    weekdays
    from
    to
  }
}
```

#### 🛡️**UpdateWorkspace** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación permite modificar los datos de un Workspace.

```
mutation UpdateWorkspace($id: ID!, $title: String, $description: String, $address: String, $lat: String, $lon: String, $capacity: Int, $price: Int, $weekdays: [String], $from: String, $to: String) {
  updateWorkspace(_id: $id, title: $title, description: $description, address: $address, lat: $lat, lon: $lon, capacity: $capacity, price: $price, weekdays: $weekdays, from: $from, to: $to) {
    _id
    title
    capacity
    description
    address
    lat
    lon
    price
    from
    to
    weekdays
  }
}
```

#### 🛡️**DeleteUser** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación elimina un Workspace.

```
mutation DeleteWorkspace($id: ID!) {
  deleteWorkspace(_id: $id) {
    _id
  }
}
```

#### 🛡️**CreateReservation** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación permite crear una Reservacion de un Workspace.

```
mutation CreateReservation($workspace: ID!, $date: String!, $hour: String!, $price: Int!, $duration: String!) {
  createReservation(workspace: $workspace, date: $date, hour: $hour, price: $price, duration: $duration) {
    _id
    user {
      _id
      username
    }
    workspace {
      _id
      title
      address
    }
    date
    hour
    price
    duration
  }
}
```

#### 🛡️**DeleteReservation** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación elimina una reservacion.

```
mutation DeleteReservation($id: ID!) {
  deleteReservation(_id: $id) {
    _id
  }
}
```

#### 🛡️**CreateComment** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación permite crear un Comentario de un Workspace.

```
mutation CreateComment($workspace: ID!, $content: String!) {
  createComment(workspace: $workspace, content: $content) {
    _id
    user {
      _id
      username
    }
    workspace
    content
    createdAt
    updatedAt
  }
}
```

#### 🛡️**DeleteComment** 
Puede probar el Modelo usando GraphQL Playground (Mutation)

Esta mutación elimina un Comentario.

```
mutation DeleteComment($id: ID!) {
  deleteComment(_id: $id) {
    _id
  }
}
```

## **Construido con** 🛠️

* [NodeJs](https://nodejs.org/dist/latest-v19.x/docs/api/)  19.8.1
* [GraphQL](https://graphql.org/code/#javascript)  16.7.1
* [Apollo-server](https://www.apollographql.com/docs/apollo-server/) 4.7.5
* [MongoDB](https://www.mongodb.com/docs/)  6.0.4
* [Mongoose](https://mongoosejs.com/docs/)  7.3.4

## **Desarrolladores** ✒️

* **Alexander Avendaño** - *Desarrollador* - [Avendaosander](https://github.com/Avendaosander)
* **Eutimio Briceño** - *Desarrollador* - [Alejo2608](https://github.com/Alejo2608)