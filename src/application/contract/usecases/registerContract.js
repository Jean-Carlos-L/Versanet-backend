import { RegisterContractDTO } from "../../../domain/dtos/ContractDTO/registerContractDTO.js";
import { ContractRepository } from "../../../infrastructure/repositories/contractRepository.js";

const contractRepository = new ContractRepository();

async function registerContract(userInput) {
    const contractDTO = new RegisterContractDTO(userInput);
    const result = await contractRepository.create(contractDTO);
    return result;
}

export { registerContract };