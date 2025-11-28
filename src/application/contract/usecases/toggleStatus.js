import { ContractRepository } from '../../../infrastructure/repositories/contractRepository.js';
import { ContractModel } from '../../../infrastructure/models/index.js';

const contractRepository = new ContractRepository();

async function toggleStatus(id, actor = null) {
        let existingContract = await contractRepository.findById(id);
        if (!existingContract) {
                const error = new Error('El contrato no existe.');
                error.status = 404;
                throw error;
        }

        if (ContractModel && ContractModel.sequelize) {
            const t = await ContractModel.sequelize.transaction();
            try {
                const result = await contractRepository.toggleStatus(id, actor, { transaction: t });
                await t.commit();
                return result;
            } catch (e) {
                await t.rollback();
                throw e;
            }
        }

        const result = await contractRepository.toggleStatus(id, actor);
        return result;
}

export { toggleStatus };