export const rolePermissionAdapterDTO = (rolePermission) => {
  return {
    id: rolePermission.idPermiso,
    description: rolePermission.permiso,
    url: rolePermission.url,
  };
};

export const rolePermissionAdapterEntity = (rolePermission) => {
  return {
    id: rolePermission.id,
    idRol: rolePermission.roleId,
    idPermiso: rolePermission.permissionId,
  };
};
