import { ContractRepository } from '../../../infrastructure/repositories/contractRepository.js';

const contractRepository = new ContractRepository();

async function getAllContracts({ page = 1, pageSize = 10, offset = 0, limit = 10, filters = {} } = {}) {
	// ensure offset/limit consistent with page/pageSize if provided
	const p = parseInt(String(page)) || 1;
	const ps = parseInt(String(pageSize)) || 10;
	const off = offset || (p - 1) * ps;
	const lim = limit || ps;

	const result = await contractRepository.findAndCountAll({ filters, offset: off, limit: lim });
	const contracts = result.rows;
	console.log(contracts)
	const total = result.count;

	return { contracts, total };
}

export { getAllContracts };
