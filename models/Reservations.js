import { model } from 'mongoose'
import { Schema } from 'mongoose'

const reservationsSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
   },
   workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspaces'
   },
   date: {
      type: String,
      required: true
   },
   hour: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   duration: {
      type: String,
      required: true
   }
})

const Reservations = model('Reservations', reservationsSchema)
export default Reservations