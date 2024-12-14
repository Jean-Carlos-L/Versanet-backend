import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { InvoiceRepository } from "../repositories/invoice.repository.js";
import { CustomerRepository } from "../../customers/repositories/costumer.repository.js";
import { PlanRepository } from "../../plans/repositories/plan.repository.js";
import { PlanCustomerRepository } from "../../plansCustomers/repositories/planCustomer.repository.js";

export async function generatePDF(invoiceId, contractId) {
  try {
    // Obtener datos de la factura
    const invoice = await InvoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw new Error("Factura no encontrada");
    }

    const contract = await PlanCustomerRepository.findById(contractId);
    if (!contract) {
      throw new Error("Contrato no encontrado");
    }

    const customer = await CustomerRepository.findById(invoice.idCliente);
    const plan = await PlanRepository.findById(contract.plan_id);
    if (!customer || !plan) {
      throw new Error("Cliente o plan no encontrado");
    }

    // Calcular la fecha máxima de pago
    const calculateDueDate = (date, daysToAdd) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + daysToAdd);

      const formatter = new Intl.DateTimeFormat("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return formatter.format(newDate);
    };

    const fechaMaximaPago = calculateDueDate(invoice.fecha_facturacion, 30);

    // Convertir logo a Base64
    const logoPath = path.resolve("public/logo.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");
    const logoSrc = `data:image/png;base64,${logoBase64}`;

    // Crear contenido HTML para la factura
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header img { width: 150px; margin-bottom: 10px; }
          .header h1 { font-size: 20px; margin: 0; }
          .header p { margin: 0; font-size: 12px; }
          .customer-info, .footer { font-size: 12px; margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { border: 1px solid black; padding: 8px; text-align: left; }
          .table th { background-color: #f0f0f0; }
          .totals { text-align: right; font-size: 14px; }
          .totals .total { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logoSrc}" alt="Logo">
          <h1>VERSANET.co S.A.S</h1>
          <p>FECHA FACTURA: ${new Date(
            invoice.fecha_facturacion
          ).toLocaleDateString("es-CO")}</p>
          <p>VALOR DEL MES: $${invoice.monto_total}</p>
        </div>
        <div class="customer-info">
          <p><strong>CLIENTE:</strong> ${customer.nombres}</p>
          <p><strong>CC/NIT:</strong> ${customer.cedula}</p>
          <p><strong>TELÉFONO:</strong> ${customer.telefono}</p>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>${plan.descripcion}</td>
              <td>1</td>
              <td>$${invoice.monto_total}</td>
            </tr>
          </tbody>
        </table>
        <div class="totals">
          <p><span>SUBTOTAL:</span> $${invoice.monto_total}</p>
          <p class="total">TOTAL A PAGAR: $${invoice.monto_total}</p>
        </div>
        <div class="footer">
          <p><strong>PUNTOS Y FORMAS DE PAGO:</strong> Recuerde que estos son los únicos métodos:</p>
          <ul>
            <li>Nequi: 3197579798</li>
            <li>Bancolombia: 762-472-7269 (ahorros)</li>
            <li>Daviplata: 3207550256</li>
          </ul>
          <p>Recuerde enviar comprobante de pago a este número: 3207550256 o 3197579798.</p>
          <p>Fecha oportuna para el pago: ${fechaMaximaPago}. En caso de no reflejarse el pago, su servicio será suspendido.</p>
        </div>
      </body>
      </html>
    `;

    // Configurar Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Cargar contenido HTML
    await page.setContent(invoiceHTML);

    // Generar PDF
    const pdfPath = path.resolve(
      `src/modules/invoices/Factura-${customer.nombres}.pdf`
    );
    await page.pdf({ path: pdfPath, format: "A4" });

    await browser.close();

    return pdfPath;
  } catch (error) {
    throw new Error("Error al generar el PDF: " + error.message);
  }
}
