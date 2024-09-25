export function userAdapterDTO(user) {
  return {
    id: user.id,
    name: user.nombres,
    email: user.correo_electronico,
    password: user.contrasena,
    role: user.idRol,
    status: user.estado,
  };
}

export const userAdapterEntity = (user) => {
  return {
    id: user.id,
    nombres: user.name,
    correo_electronico: user.email,
    contrasena: user.password,
    idRol: user.role,
    estado: user.status,
  };
};
