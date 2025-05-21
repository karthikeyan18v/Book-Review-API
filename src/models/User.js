const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Pre-save hook to hash the password before saving to the database
UserSchema.pre('save', async function(next) {
 // If the password field wasn’t modified, skip hashing
  if (!this.isModified('password')) return next();
  // Generate a salt (complexity = 10 rounds)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// Instance method to compare a plaintext password to the stored hash
UserSchema.methods.matchPassword = function(plain) {
    // bcrypt.compare returns a promise<boolean>
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', UserSchema);