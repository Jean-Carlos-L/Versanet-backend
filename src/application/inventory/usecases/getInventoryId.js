import { InventoryRepository } from '../../../infrastructure/repositories/inventoryRepository.js';

const inventoryRepository = new InventoryRepository();

async function getInventoryById(id) {
    if (!id) {
        throw new Error('ID es requerido');
    }
    const inventory = await inventoryRepository.findById(id);
    if (!inventory) {
        throw new Error('Inventario no encontrado');
    }
    return inventory;
}

export { getInventoryById };
