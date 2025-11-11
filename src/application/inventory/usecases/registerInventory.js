import { RegisterInventoryDTO} from '../../../domain/dtos/registerInventoryDTO.js';
import { InventoryRepository } from '../../../infrastructure/repositories/inventoryRepository.js';

const inventoryRepository = new InventoryRepository();

async function registerInventory(userInput) {
    const inventoryDTO = new RegisterInventoryDTO(userInput);

    const result = await inventoryRepository.create(inventoryDTO);
    return result;
}

export { registerInventory };
