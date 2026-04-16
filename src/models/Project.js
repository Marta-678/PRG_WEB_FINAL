import mongoose from 'mongoose';

const porjectSchema= new mongoose.Schema({
  user: ObjectId,          // ref: 'User' — usuario que lo creó
  company: ObjectId,       // ref: 'Company' — compañía a la que pertenece
  client: ObjectId,        // ref: 'Client' — cliente asociado
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

const Project= mongoose.model('Project', porjectSchema);
export default Project;