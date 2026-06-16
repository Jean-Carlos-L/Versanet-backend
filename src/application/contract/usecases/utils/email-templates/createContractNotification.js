import { DateUtils } from "../../../../../infrastructure/dates/dateUtils.js";

export const createContractNotification = ({ contract }) => {
  const { customer, plan, fecha_inicio, fecha_fin, inventory } = contract;

  const cliente = customer?.name || "Cliente";
  const planNombre = plan?.description || "Plan";
  const equipo = inventory?.reference || "N/A";

  const inicio = DateUtils.formatDate(fecha_inicio, "MM/DD/YYYY")
  const fin = DateUtils.formatDate(fecha_fin, "MM/DD/YYYY")

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #f9f9f9;">
      <h2 style="color: #1f2937; text-align: center;">Nuevo Contrato Activado</h2>
      <p style="color: #4b5563;">Se ha creado exitosamente un nuevo contrato en el sistema.</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h3 style="margin: 0 0 16px; color: #111827;">Detalles del Contrato #</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Cliente:</strong></td><td>${cliente}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Plan:</strong></td><td>${planNombre}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Equipo:</strong></td><td>${equipo}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Inicio:</strong></td><td>${inicio}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Fin:</strong></td><td>${fin}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Estado:</strong></td><td><span style="color: #16a34a; font-weight: bold;">Activo</span></td></tr>
        </table>
      </div>

      <p style="text-align: center; color: #6b7280; font-size: 14px;">
        Este es un mensaje automático del sistema.
      </p>
    </div>
  `.trim();
};
