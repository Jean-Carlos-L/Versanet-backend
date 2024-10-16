export function authAdapterDTO(auth) {
  return {
    id: auth.id,
    email: auth.correo_electronico,
    password: auth.contrasena,
    role: auth.idRol,
    status: auth.estado,
  };
}
