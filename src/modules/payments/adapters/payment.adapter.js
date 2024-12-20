export function paymentAdapterDTO(payment) {
  return {
    id: payment.id,
    invoice: {
      id: payment.invoice_id,
      date: payment.fecha_facturacion,
      amount: payment.monto_total,
      status: payment.status,
    },
    customer: {
      id: payment.customer_id,
      name: payment.nombres,
      document: payment.cedula,
      email: payment.correo_electronico,
      phone: payment.telefono,
      address: payment.direccion,
      status: payment.estado,
    },
    methodPaid: payment.metodo_pago,
    date: payment.fecha_pago,
    amountPaid: payment.monto_pagado,
    status: payment.estado,
  };
}

export function paymentAdapterEntity(payment) {
  return {
    id: payment.id,
    idFactura: payment.invoice_id,
    idCliente: payment.customer_id,
    metodo_pago: payment.methodPaid,
    fecha_pago: payment.date,
    monto_pagado: payment.amountPaid,
    estado: payment.status,
  };
}
