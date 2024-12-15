import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { InvoiceRepository } from "../repositories/invoice.repository.js";
import { CustomerRepository } from "../../customers/repositories/costumer.repository.js";
import { PlanRepository } from "../../plans/repositories/plan.repository.js";
import { PlanCustomerRepository } from "../../plansCustomers/repositories/planCustomer.repository.js";

export async function generatePDF(invoiceId, contractId) {
  try {
    // Utilidades
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

    const convertImageToBase64 = (imagePath) => {
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Archivo no encontrado: ${imagePath}`);
      }
      return fs.readFileSync(imagePath, "base64");
    };

    // Obtener datos de la factura, cliente, contrato y plan
    const invoice = await InvoiceRepository.findById(invoiceId);
    if (!invoice) throw new Error("Factura no encontrada");

    const contract = await PlanCustomerRepository.findById(contractId);
    if (!contract) throw new Error("Contrato no encontrado");

    const customer = await CustomerRepository.findById(invoice.idCliente);
    const plan = await PlanRepository.findById(contract.plan_id);
    if (!customer || !plan) throw new Error("Cliente o plan no encontrado");

    const fechaMaximaPago = calculateDueDate(invoice.fecha_facturacion, 30);
    const logoPath = path.resolve("public/logo.png");
    const logoBase64 = convertImageToBase64(logoPath);

    // HTML de la factura
    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura VERSANET</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; }
          .header img { width: 120px; margin-bottom: 10px; }
          .header h1 { margin: 0; font-size: 22px; color: #4CAF50; }
          .header p { margin: 0; font-size: 14px; }
          .customer-info, .footer { margin-bottom: 20px; font-size: 14px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f8f8f8; }
          .totals { text-align: right; font-size: 16px; }
          .totals .total { font-weight: bold; }
          .footer { font-size: 13px; line-height: 1.5; text-align: center; color: #555; }
          .footer ul { padding: 0; list-style: none; }
          .footer ul li { margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="data:image/png;base64,${logoBase64}" alt="Logo VERSANET">
          <h1>VERSANET.co S.A.S</h1>
          <p>Fecha Facturación: ${new Date(
            invoice.fecha_facturacion
          ).toLocaleDateString("es-CO")}</p>
          <p>Valor del Mes: $${invoice.monto_total}</p>
        </div>
        <div class="customer-info">
          <p><strong>Cliente:</strong> ${customer.nombres}</p>
          <p><strong>CC/NIT:</strong> ${customer.cedula}</p>
          <p><strong>Teléfono:</strong> ${customer.telefono}</p>
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
          <p>Subtotal: $${invoice.monto_total}</p>
          <p class="total">Total a Pagar: $${invoice.monto_total}</p>
        </div>
        <div class="footer">
          <p><strong>Puntos y formas de pago:</strong></p>
          <ul>
            <li>Nequi: 3197579798</li>
            <li>Bancolombia: 762-472-7269 (ahorros)</li>
            <li>Daviplata: 3207550256</li>
          </ul>
          <p>Enviar comprobante de pago a: 3207550256 o 3197579798.</p>
          <p>Fecha oportuna para el pago: ${fechaMaximaPago}. En caso de no reflejarse el pago, el servicio será suspendido.</p>
        </div>
      </body>
      </html>
    `;

    // Configurar Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Cargar contenido HTML
    await page.setContent(invoiceHTML, { waitUntil: "load" });

    // Generar PDF
    const pdfPath = path.resolve(
      `src/modules/invoices/Factura-${customer.cedula}.pdf`
    );
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

    await browser.close();
    return pdfPath;
  } catch (error) {
    throw new Error(`Error al generar el PDF: ${error.message}`);
  }
}
