import { RegisterInventoryDTO} from '../../../domain/dtos/registerInventoryDTO.js';
import { InventoryRepository } from '../../../infrastructure/repositories/inventoryRepository.js';
import { InventoryModel } from '../../../infrastructure/models/inventoryModel.js';

const inventoryRepository = new InventoryRepository();

async function registerInventory(userInput, actor = null) {
    const inventoryDTO = new RegisterInventoryDTO(userInput);

    // Transactional create so audit log and create are atomic
    const sequelize = InventoryModel ? InventoryModel.sequelize : null;
    // inventoryRepository will accept options with transaction
    if (InventoryModel && InventoryModel.sequelize) {
        const t = await InventoryModel.sequelize.transaction();
        try {
            const result = await inventoryRepository.create(inventoryDTO, actor, { transaction: t });
            await t.commit();
            return result;
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    const result = await inventoryRepository.create(inventoryDTO, actor);
    return result;
}

export { registerInventory };
