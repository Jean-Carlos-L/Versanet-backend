export function inventoryAdapterDTO(inventory) {
  return {
    id: inventory.id,
    reference: inventory.referencia,       
    mac: inventory.mac,                    
    ip: inventory.ip,                     
    status: inventory.estado,             
    typeInventory: {
      id: inventory.tipo_id,
      description: inventory.tipo_descripcion,
    },           
    creationDate: inventory.fecha_creacion, 
    updateDate: inventory.fecha_actualizacion, 
  };
}


export const inventoryAdapterEntity = (inventory) => {
  return {
    id: inventory.id,
    reference: inventory.reference,       
    mac: inventory.mac,                    
    ip: inventory.ip,                      
    status: inventory.status,               
    idTipo: inventory.typeInventory.id,
  };
};
