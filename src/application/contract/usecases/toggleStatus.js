import { ContractRepository } from '../../../infrastructure/repositories/contractRepository.js';

const contractRepository = new ContractRepository();

async function toggleStatus(id) {
    let existingContract = await contractRepository.findById(id);
    if (!existingContract) {
        const error = new Error('El contrato no existe.');
        error.status = 404;
        throw error;
    }

    const result = await contractRepository.toggleStatus(id);
    return result;
}

export { toggleStatus };