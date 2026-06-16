import { ContractRepository } from '../../../infrastructure/repositories/contractRepository.js';
import EditContractDTO from '../../../domain/dtos/ContractDTO/editContractDTO.js';
import { ContractModel } from '../../../infrastructure/models/index.js';

const contractRepository = new ContractRepository();

async function editContract(id, updateData = {}, actor = null) {
   const contractDTO = new EditContractDTO(updateData);
   let existingContract = await contractRepository.findById(id);
   if (!existingContract) {
     const error = new Error('El contrato no existe.');
     error.status = 404;
     throw error;
   }

  if (ContractModel && ContractModel.sequelize) {
    const t = await ContractModel.sequelize.transaction();
    try {
      const result = await contractRepository.update(id, contractDTO.payload, actor, { transaction: t });
      await t.commit();
      return result;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

    const result = await contractRepository.update(id, contractDTO.payload, actor);
    return result;
}

export { editContract };
