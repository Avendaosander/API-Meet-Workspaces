import { model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';

const userSchema = new Schema({
   username: {
      type: String,
      required: true,
      unique: true
   },
   email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   },
   rol: {
      type: String,
      default: 'User',
   },
});

userSchema.pre('save', async function(next){
   const user = this;
   if(!user.isModified('password')) return next

   try {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(user.password, salt) 

      user.password = hash;
      next();

   } catch (error) {
      console.log(error);
      throw new Error('Error al hashear la contraseña');
   }
})

userSchema.methods.comparePassword = async function(confirmPassword){
   return await bcrypt.compare(confirmPassword, this.password)
}

const Users = model('Users', userSchema);
export default Users;