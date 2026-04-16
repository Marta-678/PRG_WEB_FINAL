import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    cif: {
      type: String,
      unique: true
    },
    address: {
      street: String,
      number: String,
      postal: String,
      city: String,
      province: String
    },
    logo: String,
    isFreelance: Boolean,
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;