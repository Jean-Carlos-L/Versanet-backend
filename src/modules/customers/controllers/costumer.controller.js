import {CustomerService} from '../services/customer.services.js';

export const createCustomer = async (req, res) => {
    try {
        const customer = await CustomerService.create(req.body);
        return res.status(201).json({message: "Cliente creado con éxito"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        const customerData = req.body;
        await CustomerService.update(id, customerData);
        return res.status(200).json({message: "Cliente actualizado con éxito", data: customerData});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const {id} = req.params;
        const customer = await CustomerService.findById(id);
        return res.status(200).json({
            message: "Cliente encontrado con éxito",
            data: customer
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const getCustomers = async (req, res) => {
    try {
        const customers = await CustomerService.findAll();
        return res.status(200).json({
            message: "Clientes encontrados con éxito",
            data: customers
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const {id} = req.params;
        await CustomerService.delete(id);
        return res.status(200).json({
            message: "Cliente eliminado con éxito"
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const getCustomersByFilter = async (req, res) => {
    try {
        const {filter} = req.query;
        const customers = await CustomerService.findByFilter(filter);
        
        return res.status(200).json({
            message: "Cliente encontrado con éxito",
            data: customers
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

