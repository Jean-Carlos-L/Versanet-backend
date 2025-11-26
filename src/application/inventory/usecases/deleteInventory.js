import { InventoryRepository } from '../../../infrastructure/repositories/inventoryRepository.js';

const inventoryRepository = new InventoryRepository();

async function deleteInventory(id) {
    if (!id) {
        throw new Error('ID es requerido');
    }
    const result = await inventoryRepository.softDelete(id);
    if (!result) {
        throw new Error('Inventario no encontrado');
    }
    return { message: 'Inventario eliminado exitosamente', id };
}

export { deleteInventory };
