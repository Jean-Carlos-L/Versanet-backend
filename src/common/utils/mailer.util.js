import pkg from "nodemailer";

const transporter = pkg.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT, 10), // Asegúrate de convertir el puerto a número
  secure: process.env.MAIL_SECURE === "true", // Convertir a booleano
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
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
export const sendEmail = async (to, subject, text) => {
  console.log("Destinatario:", to);

  if (!to || !to.trim()) {
    console.error("Error: No se proporcionaron destinatarios.");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `Versanet <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html: `${text}`,
    });
    console.log("Correo enviado: ", info.messageId);
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
};
