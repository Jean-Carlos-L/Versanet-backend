export const createInvoiceNotification = ({ invoice }) => {
  const { id, amount, invoiceDate, customer } = invoice;

  const nombre = customer?.name || "Cliente";
  const fecha = new Date(invoiceDate)
    .toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .replace(/^\w/, (c) => c.toUpperCase()); // "jueves, 29 de noviembre de 2025"

  return `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <title>Nueva Factura</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f9fafa; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: #1e40af; color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px; color: #333; line-height: 1.6; }
            .highlight { background: #eff6ff; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
            .highlight strong { font-size: 28px; color: #1e40af; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
            .btn { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px; }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <h1>Nueva Factura Generada</h1>
            </div>

            <div class="content">
            <p>Hola <strong>${nombre}</strong>,</p>

            <p>Te informamos que se ha generado una nueva factura a tu nombre.</p>

            <div class="highlight">
                <p style="margin: 0; color: #475569;">Monto total</p>
                <strong>$${amount}</strong>
                <p style="margin: 10px 0 0; color: #64748b; font-size: 14px;">Fecha: ${fecha}</p>
            </div>

            <p><strong>N° de factura:</strong> ${id}</p>

            <p>Adjuntamos el documento oficial en formato PDF con todos los detalles.</p>

            <p>Quedamos atentos al pago. ¡Gracias por confiar en nosotros!</p>
            </div>

            <div class="footer">
            <p>Este es un mensaje automático. Por favor no respondas a este correo.</p>
            </div>
        </div>
        </body>
        </html>
        `.trim();
};
