import { InventoryRepository } from '../../../infrastructure/repositories/inventoryRepository.js';
import { InventoryModel } from '../../../infrastructure/models/inventoryModel.js';

const inventoryRepository = new InventoryRepository();

async function deleteInventory(id, actor = null) {
    if (!id) {
        throw new Error('ID es requerido');
    }

    if (InventoryModel && InventoryModel.sequelize) {
        const t = await InventoryModel.sequelize.transaction();
        try {
            const result = await inventoryRepository.softDelete(id, actor, { transaction: t });
            await t.commit();
            if (!result) {
                throw new Error('Inventario no encontrado');
            }
            return { message: 'Inventario eliminado exitosamente', id };
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    const result = await inventoryRepository.softDelete(id, actor);
    if (!result) {
        throw new Error('Inventario no encontrado');
    }
    return { message: 'Inventario eliminado exitosamente', id };
}

export { deleteInventory };
