import { model } from 'mongoose'
import { Schema } from 'mongoose'

const commentSchema = new Schema(
   {
      user: {
         type: Schema.Types.ObjectId,
         ref: 'Users'
      },
      workspace: {
         type: Schema.Types.ObjectId,
         ref: 'Workspaces'
      },
      content: {
         type: String,
         required: true
      }
   },
   {
      timestamps: true
   }
)

const Comments = model('Comments', commentSchema)
export default Comments