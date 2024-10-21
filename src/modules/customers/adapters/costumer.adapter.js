export function costumerAdapterDTO(costumer) {
  return {
    id: costumer.id,
    names: costumer.nombres,
    email: costumer.correo_electronico,
    phone: costumer.telefono,
    address: costumer.direccion,
    status: costumer.estado,
  };
}
export const costumerAdapterEntity = (costumer) => {
    return {
        id: costumer.id,
        nombres: costumer.names,
        correo_electronico: costumer.email,
        telefono: costumer.phone,
        direccion: costumer.address,
        estado: costumer.status,
    };
};