export const planCustomerAdapterDTO = (plan) => {
  return {
    id: plan.cliente_plan_id,
    status: plan.cliente_plan_estado,
    startDate: plan.fecha_inicio,
    endDate: plan.fecha_fin,
    plan: {
      id: plan.plan_id,
      description: plan.plan_descripcion,
      price: plan.plan_precio,
      features: plan.plan_caracteristicas,
    },
    customer: {
      id: plan.id,
      name: plan.nombres,
      document: plan.cedula,
      email: plan.correo_electronico,
      phone: plan.telefono,
      address: plan.direccion,
      status: plan.estado,
    },
    inventoryMac: {
      id: plan.inventarioMac_id,
      reference: plan.inventarioMac_referencia,
      mac: plan.inventarioMac_mac,
      ip: plan.inventarioMac_ip,
      type: plan.inventarioMac_tipo, 
      status: plan.inventarioMac_estado,
    },
    inventoryRouter: {
      id: plan.inventarioRouter_id,
      reference: plan.inventarioRouter_referencia,
      mac: plan.inventarioRouter_mac,
      ip: plan.inventarioRouter_ip,
      type: plan.inventarioRouter_tipo, 
      status: plan.inventarioRouter_estado,
    },
  };
};

export const planCustomerAdapterEntity = (plan) => {
  return {
    id: plan.id, 
    status: plan.status,
    startDate: plan.startDate,
    endDate: plan.endDate,
    idPlan: plan.plan.id,
    idCustomer: plan.customer.id,
    idMac: plan.inventoryMac.id,
    idRouter: plan.inventoryRouter.id,
  };
}
