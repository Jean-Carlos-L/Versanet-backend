import { UpdateInventoryDTO } from '../../../domain/dtos/editInventoryDTO.js';
import { InventoryRepository } from '../../../infrastructure/repositories/inventoryRepository.js';

import { InventoryModel } from '../../../infrastructure/models/inventoryModel.js';

const inventoryRepository = new InventoryRepository();

async function updateInventory(id, userInput, actor = null) {
    if (!id) {
        throw new Error('ID es requerido');
    }
    const inventoryDTO = new UpdateInventoryDTO(userInput);

    if (InventoryModel && InventoryModel.sequelize) {
        const t = await InventoryModel.sequelize.transaction();
        try {
            const result = await inventoryRepository.update(id, inventoryDTO, actor, { transaction: t });
            await t.commit();
            if (!result) {
                throw new Error('Inventario no encontrado o no actualizado');
            }
            return result;
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    const result = await inventoryRepository.update(id, inventoryDTO, actor);
    if (!result) {
        throw new Error('Inventario no encontrado o no actualizado');
    }
    return result;
}

export { updateInventory };
