export const planAdapterDTO = (plan) => {
  return {
    id: plan.id,
    description: plan.descripcion,
    features: plan.caracteristicas,
    price: plan.precio,
    status: plan.estado,
    createdAt: plan.fecha_creacion,
  };
};
