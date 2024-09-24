export function userAdapterDTO(user) {
    return {
        id: user.id,
        nombres: user.nombres,
        correo_electronico: user.correo_electronico,
        contrasena: user.contrasena,
        idRol: user.idRol,
        estado: user.estado
    };
}

export const userAdapterEntity = (user) => {
    return {
        id: user.id,
        nombres: user.name,
        correo_electronico: user.email,
        contrasena: user.password,
        idRol: user.roles,
        estado: user.status
    };
}