export const planCustomerAdapterDTO = (plan) => {
  return {
    id: plan.cliente_plan_id,
    status: plan.cliente_plan_estado,
    staticIp: plan.ip_estatica,
    mac: plan.mac_antena,
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
  };
};

export const planCustomerAdapterEntity = (plan) => {
  return {
    id: plan.id,
    estado: plan.status,
    ip_estatica: plan.staticIp,
    mac_antena: plan.mac,
    fecha_inicio: plan.startDate,
    fecha_fin: plan.endDate,
    idPlan: plan.planId,
    idCliente: plan.customerId,
  };
}