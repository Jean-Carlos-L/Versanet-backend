import {CustomerRepository} from "../repositories/costumer.repository.js";
import {customerAdapterDTO, customerAdapterEntity} from "../adapters/costumer.adapter.js";

export class CustomerService{

    static async create(customer) {
        try {
            const customerExists = await CustomerRepository.findByCedulaOrEmail(customer.cedula, customer.email);
            if (customerExists.length === 0) {
                return await CustomerRepository.create(customerAdapterEntity(customer));
            }
            throw new Error("La cédula o el correo electrónico ya se encuentra registrado");
        } catch (error) {
            console.error("Error al crear el cliente:", error.message);
            throw new Error(error.message);
        }
    }

    static async update(id, customer){
        try {
            const existingCustomer = await CustomerRepository.findByCedulaOrEmail(customer.cedula, customer.email);
            if(existingCustomer.length && existingCustomer[0].id !== id){
                throw new Error("La cedula o el correo electrónico ya se encuentra registrado");
            }
            await CustomerRepository.update(id, customerAdapterEntity(customer));
        } catch (error) {
            console.error("Error al actualizar el cliente", error.message);
            throw new Error(error.message);
        }
    }

    static async findById(id){
        try {
            const customer = await CustomerRepository.findById(id);
            if (!customer) {
                throw new Error("Cliente no encontrado");
            }
            return customerAdapterDTO(customer);
        }
        catch (error) {
            console.error("Error al obtener el cliente", error.message);
            throw new Error(error.message);
        }
    }

    static async findAll(){
        try {
            const customers = await CustomerRepository.findAll();
            return customers.map(customerAdapterDTO);
        } catch (error) {

            throw new Error(error.message);
        }
    }
    static async delete(id){
        try {
            await CustomerRepository.delete(id);
        } catch (error) {
            console.error("Error al eliminar el cliente", error);
            throw new Error("Error al eliminar el cliente");
        }
    }

    static async findByFilter(filter){
        try {
            const customers = await CustomerRepository.findByFilter(filter);
            return customers.map(customerAdapterDTO);
        } catch (error) {
            console.error("Error al obtener los clientes", error.message);
            throw new Error("Error al obtener los clientes", error.message);
        }
    }
}