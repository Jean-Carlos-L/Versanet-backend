export function roleAdapterDTO(role) {
  return {
    id: role.id,
    description: role.descripcion,
    status: role.estado,
    permissions: role.permissions,
  };
}

export const roleAdapterEntity = (role) => {
  return {
    id: role.id,
    descripcion: role.description,
    estado: role.status,
  };
};
