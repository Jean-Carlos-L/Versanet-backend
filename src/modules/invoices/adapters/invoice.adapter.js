export function invoiceAdapterDTO(invoice) {
  return {
    id: invoice.id,
    client: invoice.id_cliente,
    date: invoice.fecha_facturacion,
    total_mount: invoice.monto_total,
    status: invoice.estado,
  };
}
export function invoiceAdapterEntity(invoice) {
  return {
    id: invoice.id,
    id_cliente: invoice.client,
    fecha_facturacion: invoice.date,
    monto_total: invoice.total_mount,
    estado: invoice.status,
  };
}
