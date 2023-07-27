import { model } from 'mongoose'
import { Schema } from 'mongoose'

const workspaceSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   capacity: {
      type: Number,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   address: {
      type: String,
      unique: true,
      required: true,
   },
   lat: {
      type: String,
      required: true
   },
   lon: {
      type: String,
      required: true
   },
   weekdays: {
      type: Array,
      required: true
   },
   from: {
      type: String,
      required: true
   },
   to: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   }
})

const Workspaces = model('Workspaces', workspaceSchema)
export default Workspaces