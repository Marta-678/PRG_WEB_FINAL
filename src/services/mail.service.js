import nodemailer from 'nodemailer';

const transporter = () => {
  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT) || 2525;
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;
 
  if (!host || !user || !pass) {
    console.warn('[mail] Variables de entorno de email no configuradas — los emails no se enviarán');
    return null;
  }
 
  return nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });
};

const sendEmail = async (to, subject, text) => {
    const mailer = transporter();
    if (!mailer) {
        console.warn('[mail] No se puede enviar email: transporter no configurado');
        return;
    }
    try {
        await mailer.sendMail({
            from: process.env.MAIL_FROM || 'no-reply@bildyapp.com',
            to,
            subject,
            text
        });
    } catch (error) {
        console.error('[mail] Error enviando email:', error);
    }
};

export const sendVerificationEmail = async (to, token) => {
    const subject = 'Verificación de cuenta en BildyApp';
    const verificationLink = `https://bildyapp.com/verify?token=${token}`;
    const text = `¡Hola!\n\nGracias por registrarte en BildyApp. Por favor, haz clic en el siguiente enlace para verificar tu cuenta:\n\n${verificationLink}\n\nSi no te registraste, puedes ignorar este email.\n\n¡Saludos!\nEl equipo de BildyApp`;
    await sendEmail(to, subject, text);
};

export const sendInvitacionEmail = async (to, projectName, inviterName) => {
    const subject = `Has sido invitado a un proyecto en BildyApp`;
    const text = `¡Hola!\n\n${inviterName} te ha invitado a unirte al proyecto "${projectName}" en BildyApp. Por favor, inicia sesión para aceptar la invitación y colaborar en el proyecto.\n\n¡Saludos!\nEl equipo de BildyApp`;
    await sendEmail(to, subject, text);
};

