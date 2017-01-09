import mongoose from 'mongoose'

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});


var User = mongoose.model('User', userSchema)

export default User
