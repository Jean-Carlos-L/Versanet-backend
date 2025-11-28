import { ContractRepository } from '../../../infrastructure/repositories/contractRepository.js';

const contractRepository = new ContractRepository();

async function getContractById(id) {
    if (!id) throw new Error('Contract id is required');

    const contract = await contractRepository.findById(id);
    if (!contract) {
        const err = new Error('Contract not found');
        err.status = 404;
        throw err;
    }
    return contract;
}

export { getContractById };
