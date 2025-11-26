// src/application/inventory/usecases/listInventory.js
import { InventoryRepository } from '../../../infrastructure/repositories/inventoryRepository.js';

const inventoryRepository = new InventoryRepository();

async function getAllInventories({ 
    referencia = '', 
    mac = '', 
    direccion_red = '', 
    tipo_equipo = '', 
    estado = 'activo', 
    offset = 0, 
    limit = 10 
} = {}) {
    const filters = { referencia, mac, direccion_red, tipo_equipo, estado };
    
    try {
        const { rows: inventories, count: total } = await inventoryRepository.findAndCountAll({ 
            filters, 
            offset, 
            limit 
        });

        const inventoryData = inventories.map(inventory => inventory.toJSON());
        
        return { 
            inventories: inventoryData,  
            total 
        };
    } catch (error) {
        throw error;
    }
}

export { getAllInventories };
