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
        nombres: user.nombres,
        correo_electronico: user.correo_electronico,
        contrasena: user.contrasena,
        idRol: user.idRol,
        estado: user.estado
    };
}