import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
    {
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
  name: String,            // Nombre del cliente
  cif: String,             // CIF/NIF del cliente
  email: String,
  phone: String,
  address: {
    street: String,
    number: String,
    postal: String,
    city: String,
    province: String
  },
  deleted: Boolean,        // Soft delete
  createdAt: Date,
  updatedAt: Date
}
);

clientSchema.index({ cif: 1, company: 1 }, { unique: true });
clientSchema.index({ company: 1 });

const Client = mongoose.model('Client', clientSchema);
export default Client;