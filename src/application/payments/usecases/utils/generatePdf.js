// utils/generatePaymentReceipt.js
import puppeteer from "puppeteer";

let browserPromise = null;
const getBrowser = async () => {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browserPromise;
};

export const generatePaymentReceiptBuffer = async ({ payment }) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  const { id, amount, paymentDate, method, status, invoice } = payment;

  const cliente = invoice?.customer?.name || "Cliente";
  const facturaId = invoice?.id || "N/A";

  const fechaPago = new Date(paymentDate)
    .toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/^\w/, (c) => c.toUpperCase());

  const metodoPago =
    {
      transferencia: "Transferencia Bancaria",
      efectivo: "Efectivo",
      tarjeta: "Tarjeta de Crédito/Débito",
      pse: "PSE - Pagos en línea",
      nequi: "Nequi",
      daviplata: "Daviplata",
    }[method?.toLowerCase()] ||
    method.split("_").join(" ") ||
    "No especificado";

  const estadoColor = status === "completado" ? "#16a34a" : "#ca8a04";

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Comprobante de Pago ${id}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 40px; background: #f8fafc; color: #1e293b; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 4px solid #16a34a; margin-bottom: 30px; }
    .header h1 { color: #16a34a; margin: 0; font-size: 32px; font-weight: bold; }
    .header p { margin: 10px 0 0; font-size: 18px; color: #475569; }
    .info { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin: 30px 0; }
    .info div { flex: 1; min-width: 280px; }
    .table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .table th { background: #16a34a; color: white; padding: 14px; text-align: left; }
    .table td { padding: 14px; border-bottom: 1px solid #e2e8f0; }
    .amount { text-align: right; font-size: 32px; font-weight: bold; color: #16a34a; margin: 40px 0; }
    .success { text-align: center; margin: 40px 0; }
    .success-icon { font-size: 80px; color: #16a34a; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>COMPROBANTE DE PAGO</h1>
      <p><strong>Transacción #${id}</strong></p>
    </div>

    <div class="success">
      <div class="success-icon">Checkmark</div>
      <h2 style="color: #16a34a; margin: 20px 0;">¡Pago recibido con éxito!</h2>
    </div>

    <div class="info">
      <div>
        <p><strong>Cliente:</strong> ${cliente}</p>
        <p><strong>Factura asociada:</strong> ${facturaId}</p>
        <p><strong>Fecha y hora:</strong> ${fechaPago}</p>
        <p><strong>Método de pago:</strong> ${metodoPago}</p>
      </div>
      <div style="text-align: right;">
        <p><strong>Estado del pago:</strong> 
          <span style="color: ${estadoColor}; font-weight: bold; font-size: 18px;">
            ${status === "completado" ? "COMPLETADO" : "EN PROCESO"}
          </span>
        </p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Pago de factura de internet</td>
          <td>$${parseFloat(amount).toLocaleString("es-CO")}</td>
        </tr>
      </tbody>
    </table>

    <div class="amount">
      Total pagado: $${parseFloat(amount).toLocaleString("es-CO")}
    </div>

    <div class="footer">
      Gracias por tu pago oportuno • Este documento es válido como comprobante
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
  });

  await page.close();

  return pdfBuffer; // Buffer listo para adjuntar
};
