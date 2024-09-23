export const permissionAdapterDTO = (permission) => {
  return {
    id: permission.id,
    description: permission.descripcion,
    url: permission.url,
    status: permission.estado,
  };
};
