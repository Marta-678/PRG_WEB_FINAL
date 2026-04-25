import mongoose from 'mongoose';

const porjectSchema= new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },          // ref: 'User' — usuario que lo creó
  company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },       // ref: 'Company' — compañía a la que pertenece
  client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },        // ref: 'Client' — cliente asociado
  name: String,            // Nombre del proyecto
  projectCode: String,     // Código interno único
  address: {
    street: String,
    number: String,
    postal: String,
    city: String,
    province: String
  },
  email: String,           // Email de contacto del proyecto
  notes: String,           // Notas adicionales
  active: Boolean,
  deleted: Boolean,        // Soft delete
  createdAt: Date,
  updatedAt: Date
});

projectSchema.index({ projectCode: 1, company: 1 }, { unique: true });
projectSchema.index({ company: 1 });
projectSchema.index({ client: 1 });

const Project= mongoose.model('Project', porjectSchema);
export default Project;