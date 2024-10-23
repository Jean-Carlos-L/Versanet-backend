export function customerAdapterDTO(costumer) {
  return {
    id: costumer.id,
    nombres: costumer.nombres,
    cedula: costumer.cedula,
    correo_electronico: costumer.correo_electronico,
    telefono: costumer.telefono,
    direccion: costumer.direccion,
    estado: costumer.estado,
  };
}
export const customerAdapterEntity = (costumer) => {
    return {
        id: costumer.id,
        nombres: costumer.nombres,
        cedula: costumer.cedula,
        correo_electronico: costumer.correo_electronico,
        telefono: costumer.telefono,
        direccion: costumer.direccion,
        estado: costumer.estado,
    };
};