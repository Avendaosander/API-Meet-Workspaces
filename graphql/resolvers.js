// Importar los modelos de la DB
import { GraphQLError } from 'graphql'
import Users from '../models/Users.js'
import Workspaces from '../models/Workspaces.js'
import Reservations from '../models/Reservations.js'
import Comments from '../models/Comments.js'
import jwt from 'jsonwebtoken'

function sumarDuracionAHora(horaInicial, duracion) {
	// Separa la hora y los minutos de la duración y la hora inicial
	const [horaDuracion, minutoDuracion] = duracion.split(':').map(Number);
	const [horaInicialNum, minutoInicial] = horaInicial.split(':').map(Number);

	// Convierte la duración y la hora inicial a minutos
	const duracionEnMinutos = horaDuracion * 60 + minutoDuracion;
	const horaInicialEnMinutos = horaInicialNum * 60 + minutoInicial;

	// Suma los minutos de la duración a los minutos de la hora inicial
	const sumaEnMinutos = duracionEnMinutos + horaInicialEnMinutos;

	// Calcula el nuevo valor de la hora y los minutos resultantes de la suma
	const nuevaHora = Math.floor(sumaEnMinutos / 60);
	const nuevoMinuto = sumaEnMinutos % 60;

	// Formatea el resultado de la suma a una cadena de texto con el formato "HH:mm"
	const horaSumada = `${nuevaHora.toString().padStart(2, '0')}:${nuevoMinuto.toString().padStart(2, '0')}`;

	return horaSumada;
}

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
			const comments = await Comments.find({user: context.user._id})
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
			
			// Consulta las reservas existentes en la misma fecha
			let existingReservations = await Reservations.find({ date }).lean();

			// Verifica si hay choques de horarios
			const hasCollision = existingReservations.some(existingReservation => {
				const { hour: hourR , duration: durationR } = existingReservation
				const existingTime = sumarDuracionAHora(hourR, durationR)
				return (hour >= hourR && hour < existingTime) 
			});

			if (hasCollision) {
			  throw new GraphQLError('Este espacio de trabajo ya está ocupado');
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
