import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String, select: false },
    name: String,
    lastName: String,
    nif: String,
    role: {
      type: String,
      enum: ['admin', 'guest'],
      default: 'admin'
    },
    status: {
      type: String,
      enum: ['pending', 'verified'],
      default: 'pending'
    },
    verificationCode: String,
    verificationAttempts: {
      type: Number,
      default: 3
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    address: {
      street: String,
      number: String,
      postal: String,
      city: String,
      province: String
    },
    refreshToken: {
      type: String,
      select: false
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes para consultas frecuentes
userSchema.index({ company: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });


userSchema.virtual('fullName').get(function () {
  return `${this.name || ''} ${this.lastName || ''}`.trim();
});

userSchema.pre(/^find/, function (next) {
  this.where({ deleted: false });
  next();
});

const User = mongoose.model('User', userSchema);

export default User;