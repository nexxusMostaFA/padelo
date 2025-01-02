const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      select: false,
    },
    googleId: { type: String },
    image: {
      type: String,
      default: 'https://www.viverefermo.it/images/user.png',
    },
    phoneNumber: {
      type: String,
    },
    isVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true },
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew)
    return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
