import { ContractRepository } from '../../../infrastructure/repositories/contractRepository.js';
import { ContractModel } from '../../../infrastructure/models/index.js';

const contractRepository = new ContractRepository();

async function deleteContract(id, actor = null) {
    if (!id) {
        const err = new Error('Contract id is required');
        err.status = 400;
        throw err;
    }

    if (ContractModel && ContractModel.sequelize) {
        const t = await ContractModel.sequelize.transaction();
        try {
            const result = await contractRepository.softDelete(id, actor, { transaction: t });
            if (!result) {
                const err = new Error('Contract not found');
                err.status = 404;
                throw err;
            }
            await t.commit();
            return { success: true };
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    const result = await contractRepository.softDelete(id, actor);
    if (!result) {
        const err = new Error('Contract not found');
        err.status = 404;
        throw err;
    }
    return { success: true };
}

export { deleteContract };
