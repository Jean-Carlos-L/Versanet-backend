export function customerAdapterDTO(costumer) {
  return {
    id: costumer.id,
    names: costumer.nombres,
    cedula: costumer.cedula,
    email: costumer.correo_electronico,
    phone: costumer.telefono,
    address: costumer.direccion,
    status: costumer.estado,
  };
}
export const customerAdapterEntity = (costumer) => {
    return {
        id: costumer.id,
        nombres: costumer.names,
        cedula: costumer.cedula,
        correo_electronico: costumer.email,
        telefono: costumer.phone,
        direccion: costumer.address,
        estado: costumer.status,
    };
};