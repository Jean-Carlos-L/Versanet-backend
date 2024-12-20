import pkg from "nodemailer";
import {
  MAIL_HOST,
  MAIL_PASS,
  MAIL_PORT,
  MAIL_SECURE,
  MAIL_USER,
} from "../constants/constants.js";
const transporter = pkg.createTransport({
  host: MAIL_HOST,
  port: parseInt(MAIL_PORT, 10), // Asegúrate de convertir el puerto a número
  secure: MAIL_SECURE === "true", // Convertir a booleano
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

// Verificación de conexión al servidor de correo
transporter.verify((error) => {
  if (error) {
    console.error("Error al conectar con el servidor de correo:", error);
  } else {
    console.log("Conectado al servidor de correo");
  }
});

// Función para enviar el correo
export const sendEmail = async (to, subject, text, nameFile, pdfPath) => {
  console.log("Destinatario:", to);

  if (!to || !to.trim()) {
    console.error("Error: No se proporcionaron destinatarios.");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `Versanet <${MAIL_USER}>`,
      to,
      subject,
      text,
      html: `${text}`,
      attachments: [
        {
          filename: nameFile,
          path: pdfPath,
        },
      ],
    });
    console.log("Correo enviado: ", info.messageId);
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
};
