import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    projectCode: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: String,
      number: String,
      postal: String,
      city: String,
      province: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

projectSchema.index({ projectCode: 1, company: 1 }, { unique: true });
projectSchema.index({ company: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ deleted: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;