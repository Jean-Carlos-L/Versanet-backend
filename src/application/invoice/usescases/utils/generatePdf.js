// utils/generatePdf.js
import puppeteer from "puppeteer";
import { DateUtils } from "../../../../infrastructure/dates/dateUtils.js";

let browserPromise = null;

// Reutilizamos el browser para mejorar rendimiento (opcional pero recomendado)
const getBrowser = async () => {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browserPromise;
};

export const generatePdfBuffer = async ({ invoice, customer, contract }) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  const startDate = DateUtils.formatDate(contract.startDate, "YYYY-MM-DD");
  const endDate = DateUtils.formatDate(contract.endDate, "YYYY-MM-DD");

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Factura ${invoice.id}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 40px; background: #f8fafc; color: #1e293b; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 4px solid #1e40af; margin-bottom: 30px; }
    .header h1 { color: #1e40af; margin: 0; font-size: 32px; font-weight: bold; }
    .info { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin: 30px 0; }
    .info div { flex: 1; min-width: 280px; }
    .table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .table th { background: #1e40af; color: white; padding: 14px; text-align: left; }
    .table td { padding: 14px; border-bottom: 1px solid #e2e8f0; }
    .total { text-align: right; font-size: 28px; font-weight: bold; color: #1e40af; margin: 40px 0; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>FACTURA</h1>
      <p style="margin: 10px 0 0; font-size: 18px;"><strong>N° ${
        invoice.id
      }</strong></p>
    </div>

    <div class="info">
      <div>
        <p><strong>Cliente:</strong> ${customer.name}</p>
        <p><strong>Documento:</strong> ${customer.document || "N/A"}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Teléfono:</strong> ${customer.phone || "N/A"}</p>
        <p><strong>Dirección:</strong> ${
          customer.address || "No registrada"
        }</p>
      </div>
      <div style="text-align: right;">
        <p><strong>Fecha de emisión:</strong> ${new Date(
          invoice.invoiceDate
        ).toLocaleDateString("es-ES", { dateStyle: "long" })}</p>
        <p><strong>Período del servicio:</strong><br>
          ${startDate} → ${endDate}
        </p>
        <p><strong>Estado:</strong> <span style="color: #dc2626; font-weight: bold;">${invoice.status.toUpperCase()}</span></p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Plan</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Servicio de Internet</td>
          <td>${contract.plan?.description || "Plan contratado"}</td>
          <td>$${invoice.amount}</td>
        </tr>
      </tbody>
    </table>

    <div class="total">
      Total a pagar: $${invoice.amount}
    </div>

    <div class="footer">
      Gracias por tu preferencia · Documento generado automáticamente
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // Generamos el PDF como Buffer
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
  });

  await page.close();

  return pdfBuffer; // ← ¡Buffer listo para adjuntar!
};
