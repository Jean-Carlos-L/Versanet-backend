import { ContractRepository } from '../../../infrastructure/repositories/contractRepository.js';

const contractRepository = new ContractRepository();

async function deleteContract(id) {
    if (!id) {
        const err = new Error('Contract id is required');
        err.status = 400;
        throw err;
    }

    const result = await contractRepository.softDelete(id);
    if (!result) {
        const err = new Error('Contract not found');
        err.status = 404;
        throw err;
    }
    return { success: true };
}

export { deleteContract };
