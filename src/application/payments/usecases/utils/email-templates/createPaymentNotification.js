// templates/paymentConfirmationSimpleHTML.js
export const createPaymentNotificationSimpleHTML = ({ payment }) => {
  const { id, amount, paymentDate, method, invoice } = payment;

  const nombreCliente = invoice?.customer?.name || "Cliente";
  const fecha = new Date(paymentDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const metodoTexto = method
    ? method.charAt(0).toUpperCase() + method.split("_").join(" ").slice(1).toLowerCase()
    : "No especificado";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pago Confirmado</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f9fafa; margin: 0; padding: 20px; color: #333; }
    .container { max-width: 580px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
    .header { background: #16a34a; color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; line-height: 1.6; }
    .amount { font-size: 32px; font-weight: bold; color: #16a34a; text-align: center; margin: 20px 0; }
    .info { background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .info p { margin: 8px 0; }
    .info strong { color: #1e293b; }
    .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 13px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pago Confirmado</h1>
    </div>

    <div class="content">
      <p>Hola <strong>${nombreCliente}</strong>,</p>
      <p>¡Excelente noticia! Hemos recibido tu pago correctamente.</p>

      <div class="amount">
        $${parseFloat(amount).toLocaleString("es-CO")}
      </div>

      <div class="info">
        <p><strong>Transacción:</strong> ${id}</p>
        <p><strong>Factura:</strong> ${invoice.id}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Método:</strong> ${metodoTexto}</p>
      </div>

      <p>Adjuntamos tu comprobante de pago en formato PDF.</p>
      <p>¡Gracias por mantener tus pagos al día!</p>
    </div>

    <div class="footer">
      <p>Este es un mensaje automático • No respondas a este correo</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};
