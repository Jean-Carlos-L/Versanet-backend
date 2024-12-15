import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { PlanCustomerRepository } from "../../plansCustomers/repositories/planCustomer.repository.js";

export async function generatePDFPayment(invoice, customer) {
  try {
    const plan = await PlanCustomerRepository.findById(invoice.idCliente_Plan);
    if (!plan) {
      throw new Error("Plan no encontrado");
    }
    const logoPath = path.resolve("public/logo.png");
    if (!fs.existsSync(logoPath)) {
      throw new Error("El logo no se encuentra en la ruta especificada.");
    }
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    const generateInvoiceHTML = (invoice, customer, logoBase64) => `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pago</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 20px 10px;
          }
          .header img {
            max-width: 100px;
            margin-bottom: 10px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
          }
          .content h2 {
            font-size: 20px;
            margin: 0 0 10px;
          }
          .content p {
            margin: 5px 0;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .table th, .table td {
            text-align: left;
            border: 1px solid #ddd;
            padding: 8px;
          }
          .table th {
            background-color: #f4f4f4;
          }
          .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px 20px;
            font-size: 14px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Encabezado -->
          <div class="header">
            <img src="data:image/png;base64,${logoBase64}" alt="Logo">
            <h1>Confirmación de Pago</h1>
          </div>

          <!-- Contenido -->
          <div class="content">
            <h2>¡Gracias por tu pago!</h2>
            <p>Hemos recibido tu pago exitosamente. Aquí están los detalles:</p>
            <p><strong>Cliente:</strong> ${customer.nombres}</p>
            <p><strong>ID del Pago:</strong> ${invoice.id}</p>
            <p><strong>Fecha del Pago:</strong> ${new Date(
              invoice.fecha_facturacion
            ).toLocaleDateString("es-CO")}</p>

            <!-- Tabla de detalles del pago -->
            <table class="table">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${plan.plan_descripcion}</td>
                  <td>$ ${invoice.monto_total}</td>
                </tr>
              </tbody>
            </table>

            <p><strong>Total Pagado:</strong> $${invoice.monto_total}</p>
            <p>Si tienes alguna duda, puedes contactarnos a través de nuestro correo o número de teléfono.</p>
          </div>

          <!-- Pie de página -->
          <div class="footer">
            <p>Gracias por confiar en nosotros.</p>
            <p>Para cualquier consulta, por favor contáctanos al 3207550256 o 3197579798, también puedes escribirnos al soporte@versanet.co</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const invoiceHTML = generateInvoiceHTML(invoice, customer, logoBase64);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(invoiceHTML, { waitUntil: "networkidle0" });

    const pdfPath = path.resolve(
      `src/modules/payments/Recibo-${customer.cedula}.pdf`
    );
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

    await browser.close();

    return pdfPath;
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw new Error("Error al generar el PDF: " + error.message);
  }
}
