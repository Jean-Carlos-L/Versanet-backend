export function roleAdapterDTO(role) {
    return {
        id: role.id,
        nombre: role.nombre,
        descripcion: role.descripcion,
        estado: role.estado
    }
}

export const roleAdapterEntity = (role) => {
    return {
        id: role.id,
        nombre: role.nombre,
        descripcion: role.descripcion,
        estado: role.estado
    }
}