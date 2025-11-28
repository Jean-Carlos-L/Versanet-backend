import { RegisterContractDTO } from "../../../domain/dtos/ContractDTO/registerContractDTO.js";
import { ContractRepository } from "../../../infrastructure/repositories/contractRepository.js";
import { ContractModel } from "../../../infrastructure/models/index.js";

const contractRepository = new ContractRepository();

async function registerContract(userInput, actor = null) {
    const contractDTO = new RegisterContractDTO(userInput);

    if (ContractModel && ContractModel.sequelize) {
        const t = await ContractModel.sequelize.transaction();
        try {
            const result = await contractRepository.create(contractDTO, actor, { transaction: t });
            await t.commit();
            return result;
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    const result = await contractRepository.create(contractDTO, actor);
    return result;
}

export { registerContract };