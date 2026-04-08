const mongoose = require('mongoose');

const ROLES = ['LEARNER', 'ADMIN', 'TRAINER', 'RH_COMPANY', 'RH_SMARTEK', 'PARTNER'];

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 50 },
  email:     { type: String, required: true, unique: true, maxlength: 100 },
  password:  { type: String, required: true },
  phone:     { type: String, maxlength: 20, default: null },
  role:      { type: String, enum: ROLES, required: true },
  image:     { type: String, default: null }, // base64
  experience:{ type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
