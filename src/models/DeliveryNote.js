import mongoose, { mongo } from 'mongoose';

const deliveryNoteSchema=new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },          // ref: 'User' — usuario que crea
  company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },       // ref: 'Company' — compañía a la que pertenece
  client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },        // ref: 'Client'
  project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },       // ref: 'Project'
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

deliveryNoteSchema.index({ company: 1 });
deliveryNoteSchema.index({ project: 1 });
deliveryNoteSchema.index({ client: 1 });

const DeliveryNote= mongoose.model('DeliveryNote', deliveryNoteSchema);
export default DeliveryNote;