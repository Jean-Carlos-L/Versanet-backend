export function invoiceAdapterDTO(invoice) {
  return {
    id: invoice.id,
    plan: {
      id: invoice.plan_id,
      description: invoice.plan_descripcion,
      price: invoice.plan_precio,
      features: invoice.plan_caracteristicas,
    },
    customer: {
      id: invoice.cliente_id,
      name: invoice.nombres,
      document: invoice.cedula,
      email: invoice.correo_electronico,
      phone: invoice.telefono,
      addres: invoice.direccion,
      status: invoice.estado,
    },
    dateInvoice: invoice.fecha_facturacion,
    mount: invoice.monto_total,
    status: invoice.estado,
  };
}
export function invoiceAdapterEntity(invoice) {
  return {
    id: invoice.id,
    isCliente_Plan: invoice.plan.id,
    idCliente: invoice.customer.id,
    fecha_facturacion: invoice.date,
    monto_total: invoice.mount,
    estado: invoice.status,
  };
}
