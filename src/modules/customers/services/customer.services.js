import {CustomerRepository} from "../repositories/customer.repository.js";
import {customerAdapterDTO, customerAdapterEntity} from "../adapters/customer.adapter.js";

export class CustomerService{

    static async create(customer){
        try {
            return await CustomerRepository.create(customerAdapterEntity(customer));
        } catch (error) {
            console.error("Error al crear el cliente", error);
            throw new Error("Error al crear el cliente");
        }
    }

    static async update(id, customer){
        try {
            await CustomerRepository.update(id, customerAdapterEntity(customer));
        } catch (error) {
            console.error("Error al actualizar el cliente", error);
            throw new Error("Error al actualizar el cliente");
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
            console.error("Error al obtener el cliente", error);
            throw new Error("Error al obtener el cliente");
        }
    }

    static async findAll(){
        try {
            const customers = await CustomerRepository.findAll();
            return customers.map(customerAdapterDTO);
        } catch (error) {
            console.error("Error al obtener los clientes", error);
            throw new Error("Error al obtener los clientes");
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
            console.error("Error al obtener los clientes", error);
            throw new Error("Error al obtener los clientes");
        }
    }



}