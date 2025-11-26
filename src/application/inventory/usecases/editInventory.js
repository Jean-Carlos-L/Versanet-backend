import { UpdateInventoryDTO } from '../../../domain/dtos/editInventoryDTO.js';
import { InventoryRepository } from '../../../infrastructure/repositories/inventoryRepository.js';

const inventoryRepository = new InventoryRepository();

async function updateInventory(id, userInput) {
    if (!id) {
        throw new Error('ID es requerido');
    }
    const inventoryDTO = new UpdateInventoryDTO(userInput);
    const result = await inventoryRepository.update(id, inventoryDTO);
    if (!result) {
        throw new Error('Inventario no encontrado o no actualizado');
    }
    return result;
}

export { updateInventory };
