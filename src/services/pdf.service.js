import PDFDocument from 'pdfkit';
import { uploadPdf } from './storage.service.js';

const colors = {
    primary:    '#1a1a2e',
    secondary:  '#6c757d',
    accent:     '#4361ee',
    light:      '#f8f9fa',
    border:     '#dee2e6',
};

const drawHLine = (doc, y, color = COLORS.border) => {
  doc.save().strokeColor(color).lineWidth(0.5).moveTo(50, y).lineTo(545, y).stroke().restore();
};
 
const labelValue = (doc, label, value, x, y) => {
  doc.fontSize(9).fillColor(COLORS.secondary).text(label, x, y);
  doc.fontSize(10).fillColor(COLORS.primary).text(value || '-', x, y + 13);
};

const generatePdfBuffer = (deliveryNote) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
 
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
 
    const { client, project, company, user, format, workDate, description,material, quantity, unit, hours, workers, signatureUrl } = deliveryNote;
    
    doc.rect(0, 0, 595, 100).fill(COLORS.light);
    doc.fontSize(20).fillColor(COLORS.accent).text('ALBARAN DE OBRA', 50, 30);
    doc.fontSize(10).fillColor(COLORS.secondary).text(`Ref: ${deliveryNote._id}`, 50, 58);
    doc.fontSize(10).fillColor(COLORS.secondary).text( `Fecha: ${new Date(workDate).toLocaleDateString('es-ES')}`, 50, 73);

    if (company) {
      doc.fontSize(11).fillColor(COLORS.primary).text(company.name || '', 350, 30, { width: 195, align: 'right' });
      doc.fontSize(9).fillColor(COLORS.secondary).text(company.cif || '', 350, 46, { width: 195, align: 'right' });
      if (company.address?.city) {
        doc.text(`${company.address.city}`, 350, 60, { width: 195, align: 'right' });
      }
    }
 
    let y = 120;

    drawHLine(doc, y - 5);
    doc.fontSize(11).fillColor(COLORS.accent).text('DATOS DEL PROYECTO', 50, y);
    y += 20;
 
    labelValue(doc, 'CLIENTE',        client?.name || '-',        50,  y);
    labelValue(doc, 'CIF/NIF',        client?.cif  || '-',        200, y);
    labelValue(doc, 'PROYECTO',       project?.name || '-',       350, y);
    y += 40;
 
    labelValue(doc, 'CODIGO PROYECTO', project?.projectCode || '-', 50,  y);
    labelValue(doc, 'RESPONSABLE',     user ? `${user.name || ''} ${user.lastName || ''}`.trim() : '-', 200, y);
    y += 40;
 
    drawHLine(doc, y);
    y += 15;

    doc.fontSize(11).fillColor(COLORS.accent).text('DETALLE DEL TRABAJO', 50, y);
    y += 20;
 
    if (description) {
      doc.fontSize(9).fillColor(COLORS.secondary).text('DESCRIPCION', 50, y);
      doc.fontSize(10).fillColor(COLORS.primary).text(description, 50, y + 13, { width: 495 });
      y += 35 + (description.length > 80 ? 15 : 0);
    }
 
    if (format === 'hours') {
        labelValue(doc, 'FORMATO', 'Horas de trabajo', 50, y);
      labelValue(doc, 'TOTAL HORAS', `${hours || 0} h`, 200, y);
      y += 40;
 
      if (workers && workers.length > 0) {
        doc.fontSize(9).fillColor(COLORS.secondary).text('TRABAJADORES', 50, y);
        y += 15;
 
        doc.rect(50, y, 495, 18).fill(COLORS.light);
        doc.fontSize(9).fillColor(COLORS.primary)
          .text('Nombre', 60, y + 4)
          .text('Horas', 460, y + 4);
        y += 20;
 
        workers.forEach((w, i) => {
          if (i % 2 === 0) doc.rect(50, y, 495, 18).fill('#ffffff');
          else             doc.rect(50, y, 495, 18).fill(COLORS.light);
          doc.fontSize(9).fillColor(COLORS.primary)
            .text(w.name || '-', 60, y + 4)
            .text(`${w.hours || 0} h`, 460, y + 4);
          y += 20;
        });
        doc.rect(50, y, 495, 18).fill(COLORS.accent);
        doc.fontSize(9).fillColor('#ffffff')
          .text('TOTAL', 60, y + 4)
          .text(`${hours || 0} h`, 460, y + 4);
        y += 28;
      }
    } else {
      labelValue(doc, 'FORMATO',   'Material',          50,  y);
      labelValue(doc, 'MATERIAL',  material || '-',     200, y);
      labelValue(doc, 'CANTIDAD',  `${quantity || 0} ${unit || ''}`.trim(), 350, y);
      y += 40;
    }
    drawHLine(doc, y);
    y += 15;
    doc.fontSize(11).fillColor(COLORS.accent).text('FIRMA', 50, y);
    y += 20;
 
    if (signatureUrl) {
      try {
        doc.image(signatureUrl, 50, y, { width: 200, height: 80, fit: [200, 80] });
        y += 95;
      } catch {
        doc.fontSize(9).fillColor(COLORS.secondary).text('(firma no disponible)', 50, y);
        y += 20;
      }
    } else {
        doc.rect(50, y, 200, 70).stroke(COLORS.border);
      doc.fontSize(8).fillColor(COLORS.secondary).text('Firma del cliente', 50, y + 75);
      y += 95;
    }
    drawHLine(doc, 760);
    doc.fontSize(8).fillColor(COLORS.secondary).text(
      `Generado por BildyApp el ${new Date().toLocaleString('es-ES')}`,
      50, 768, { align: 'center', width: 495 }
    );
 
    doc.end();

});

export const generateAndUploadPdf = async (deliveryNote) => {
  const buffer = await generatePdfBuffer(deliveryNote);
  const { url } = await uploadPdf(buffer, 'pdfs');
  return url;
};