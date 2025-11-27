import { ContractRepository } from '../../../infrastructure/repositories/contractRepository.js';
import EditContractDTO from '../../../domain/dtos/ContractDTO/editContractDTO.js';

const contractRepository = new ContractRepository();

async function editContract(id, updateData = {}) {
   const contractDTO = new EditContractDTO(updateData);
   let existingContract = await contractRepository.findById(id);
   if (!existingContract) {
     const error = new Error('El contrato no existe.');
     error.status = 404;
     throw error;
   }

    const result = await contractRepository.update(id, contractDTO.payload);
    return result;
}

export { editContract };
