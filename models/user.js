import mongoose from 'mongoose'

var userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
});


var User = mongoose.model('User', userSchema)

export default User
