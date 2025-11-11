import { InventoryRepository } from '../../../infrastructure/repositories/inventoryRepository.js';

const inventoryRepository = new InventoryRepository();

async function getInventoryCount(filters = {}) {
    return await inventoryRepository.count({ filters });
}

export { getInventoryCount };