// Importar los modelos de la DB
import { GraphQLError } from 'graphql'
import Users from '../models/Users.js'
import Workspaces from '../models/Workspaces.js'
import Reservations from '../models/Reservations.js'
import Comments from '../models/Comments.js'
import jwt from 'jsonwebtoken'
import { sumarDuracionAHora } from '../utils/helpers.js'

export const resolvers = {
	Query: {
		// Peticiones GET del Proyecto
		getUsers: async (_, { _id }, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}
			if (!context.isAdmin) {
				
				throw new GraphQLError('Not admin role', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}
			return await Users.find().lean()
		},
		getWorkspace: async (_, { _id }, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}
			const workspace = await Workspaces.findById(_id).lean()
			const comments = await Comments.find({workspace: _id})
				.populate(
					{ path: 'user', select: 'username' },
				)
				.sort({ createdAt: 0 })
				.lean()
			return { workspace, comments }
		},
		getWorkspaces: async (_, args, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}
			return await Workspaces.find().lean()
		},
		getReservations: async (_, args, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}
			if (context.user.rol === 'Admin') {
				return await Reservations.find()
					.populate(
						{ path: 'user', select: 'username' },
					)
					.populate(
						{ path: 'workspace', select: 'title address price' }
					)
					.lean()
			}
			return await Reservations.find({user: context.user._id})
				.populate(
					{ path: 'user', select: 'username' },
				)
				.populate(
					{ path: 'workspace', select: 'title address price' }
				)
				.lean()
		}
	},
	Mutation: {
		// Peticiones POST, PUT, DELETE del Proyecto
		login: async (_, { username, password }) => {
			let user = await Users.findOne({ username })
			if (!user) throw new GraphQLError('No existe este username')

			if (!(await user.comparePassword(password)))
				throw new GraphQLError('La contraseña no es correcta')

			const token = jwt.sign({ id: user._id }, process.env.SECRETTK, {
				expiresIn: '1d'
			})

			return {
				token,
				username: user.username,
				email: user.email,
				rol: user.rol
			}
		},
		register: async (_, { username, email, password }) => {
			let user = await Users.findOne({ $or: [{ username }, { email }] })
			if (user) {
				if (user.username === username)
					throw new GraphQLError('Este nombre de usuario ya esta en uso')
				if (user.email === email)
					throw new GraphQLError('Este correo ya esta en uso')
			}

			user = new Users({ username, email, password })
			await user.save()

			const token = jwt.sign({ id: user._id }, process.env.SECRETTK, {
				expiresIn: '1d'
			})

			return {
				token,
				username: user.username,
				email: user.email,
				rol: user.rol
			}
		},
		updateUser: async (_, args, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			if (!context.isAdmin) {
				throw new GraphQLError('Not admin Role', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}
			
			if (args.username) {
				const user = await Users.findOne({ username: args.username })
				if (user) {
					if (user.username === args.username)
						throw new GraphQLError('Este nombre de usuario ya esta en uso')
				}
			}

			if (args.email) {
				const user = await Users.findOne({ username: args.email })
				if (user) {
					if (user.email === args.email)
						throw new GraphQLError('Este correo ya esta en uso')
				}
			}

			const user = await Users.findByIdAndUpdate(args._id, args, {
				new: true
			})
			if (!user) throw new GraphQLError('Espacio de trabajo no fue encontrado')
			return user
		},
		deleteUser: async (_, { _id }, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			if (!context.isAdmin) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}
			const userDeleted = await Users.findByIdAndDelete(_id).lean()
			if (!userDeleted) throw new GraphQLError('Usuario no fue encontrado')
			return userDeleted._id
		},
		createWorkspace: async (_, { title, capacity, description, address, lat, lon, weekdays, from, to, price }, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			if (!context.isAdmin) {
				throw new GraphQLError('Not admin role', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			let workspace = await Workspaces.findOne({ address: address })
			
			if (workspace) throw new GraphQLError('Esta dirección ya está ocupada')
			
			workspace = new Workspaces({ title, description, capacity, address, lat, lon, weekdays, from, to, price })
			await workspace.save()

			return workspace
		},
		updateWorkspace: async (_, args, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			if (!context.isAdmin) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			if (args.address) {
				const workspace = await Workspaces.findOne({ address: address })
	
				if (workspace) throw new GraphQLError('Esta dirección ya está ocupada')
			}

			const workspace = await Workspaces.findByIdAndUpdate(args._id, args, {
				new: true
			})
			if (!workspace)
				throw new GraphQLError('Espacio de trabajo no fue encontrado')
			return workspace
		},
		deleteWorkspace: async (_, { _id }, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			if (!context.isAdmin) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}
			const workspaceDeleted = await Workspaces.findByIdAndDelete(_id).lean()
			if (!workspaceDeleted)
				throw new GraphQLError('Espacio de trabajo no fue encontrado')
			return workspaceDeleted._id
		},
		createReservation: async (_, { workspace, date, hour, price, duration }, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			const user = context.user._id

			let workspaceR = await Workspaces.findById(workspace).lean();
			
			// Consulta las reservas existentes en la misma fecha
			let existingReservations = await Reservations.find({ workspace, date }).lean();

			// Verifica si hay choques de horarios
			const reservationsForSameHour = existingReservations.filter(
				existingReservation =>
				hour >= existingReservation.hour  &&
					hour <=
					sumarDuracionAHora(
						existingReservation.hour,
						existingReservation.duration
					) 
			)

			if (reservationsForSameHour.length >= workspaceR.capacity) {
				throw new GraphQLError('Se alcanzó el límite máximo de reservaciones para la misma hora.');
			}

			let reservation = new Reservations({ user, workspace, date, hour, price, duration })
			await reservation.save()
			reservation = await Reservations.findById(reservation._id)
				.populate(
					{ path: 'user', select: 'username' },
				)
				.populate(
					{ path: 'workspace', select: 'title address price' }
				)
				.lean()
			
			return reservation
		},
		deleteReservation: async (_, { _id }, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			const reservationDeleted = await Reservations.findByIdAndDelete(_id).lean()
			if (!reservationDeleted)
				throw new GraphQLError('Reservacion no fue encontrada')
			return reservationDeleted._id
		},
		createComment: async (_, { workspace, content }, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			const user = context.user._id
			
			let comment = new Comments({ user, workspace, content })
			await comment.save()
			comment = await Comments.findById(comment._id)
				.populate(
					{ path: 'user', select: 'username' },
				)
				.lean()
			
			return comment
		},
		deleteComment: async (_, { _id }, context) => {
			if (!context.auth) {
				throw new GraphQLError('Not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
						http: { status: 401 }
					}
				})
			}

			const commentDeleted = await Comments.findByIdAndDelete(_id).lean()
			if (!commentDeleted)
				throw new GraphQLError('Comentario no fue encontrado')
			return commentDeleted._id
		},
	}
}
