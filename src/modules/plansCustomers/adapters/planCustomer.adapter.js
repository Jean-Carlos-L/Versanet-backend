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
      name: plan.nombre,
      document: plan.cedula,
      email: plan.email,
      phone: plan.telefono,
      address: plan.direccion,
      status: plan.estado,
    },
  };
};
