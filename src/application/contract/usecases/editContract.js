import { ContractRepository } from '../../../infrastructure/repositories/contractRepository.js';
import EditContractDTO from '../../../domain/dtos/ContractDTO/editContractDTO.js';

const contractRepository = new ContractRepository();

async function editContract(id, updateData = {}) {
    if (!id) {
        const err = new Error('Contract id is required');
        err.status = 400;
        throw err;
    }
    let dto;
    try {
        const parsed = new EditContractDTO(updateData);
        dto = parsed.payload;
    } catch (err) {
        const e = new Error(err.message || 'Invalid input');
        e.status = 400;
        throw e;
    }

    const updated = await contractRepository.update(id, dto);
    if (!updated) {
        const err = new Error('Contract not found or not updated');
        err.status = 404;
        throw err;
    }
    return updated;
}

export { editContract };
