import mongoose, { mongo } from 'mongoose';

const deliveryNoteSchema=new mongoose.Schema({
  user: ObjectId,          // ref: 'User' — usuario que crea
  company: ObjectId,       // ref: 'Company' — compañía a la que pertenece
  client: ObjectId,        // ref: 'Client'
  project: ObjectId,       // ref: 'Project'
  format: 'material' | 'hours',  // Tipo de albarán
  description: String,
  workDate: Date,          // Fecha del trabajo
  // Para format: 'material'
  material: String,
  quantity: Number,
  unit: String,
  // Para format: 'hours'
  hours: Number,
  workers: [{              // Múltiples trabajadores (opcional)
    name: String,
    hours: Number
  }],
  // Firma
  signed: Boolean,
  signedAt: Date,
  signatureUrl: String,    // URL de la imagen de firma (Cloudinary/R2)
  pdfUrl: String,          // URL del PDF firmado en la nube
  deleted: Boolean,        // Soft delete
  createdAt: Date,
  updatedAt: Date
});

const DeliveryNote= mongoose.model('DeliveryNote', deliveryNoteSchema);
export default DeliveryNote;