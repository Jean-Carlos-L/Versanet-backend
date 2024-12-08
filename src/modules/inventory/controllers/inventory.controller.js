import {InventoryService} from '../services/inventory.services.js';

export const createInventory = async (req, res) => {
    try {
        const inventory = await InventoryService.create(req.body);
        return res.status(201).json({message: "Inventario creado con éxito"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const updateInventory = async (req, res) => {
    try {
        const id = req.params.id;
        const inventoryData = req.body;
        await InventoryService.update(id, inventoryData);
        return res.status(200).json({message: "Inventario actualizado con éxito", data: inventoryData});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const getInventoryById = async (req, res) => {
    try {
        const {id} = req.params;
        const inventory = await InventoryService.findById(id);
        return res.status(200).json({
            message: "Inventario encontrado con éxito",
            data: inventory
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const getInventories = async (req, res) => {
    try {
        const inventories = await InventoryService.findAll(req.query);
        return res.status(200).json({
            message: "Inventarios encontrados con éxito",
            data: inventories
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const getCountInventories = async (req, res) => {
    try {
        const total = await InventoryService.countInventories(req.query);
        return res.status(200).json({
            message: "Total de inventarios encontrados con éxito",
            data: total
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const deleteInventory = async (req, res) => {
    try {
        const {id} = req.params;
        await InventoryService.delete(id);
        return res.status(200).json({
            message: "Inventario eliminado con éxito"
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const getInventoryByReference = async (req, res) => {
    try {
        const {reference} = req.params;
        const inventory = await InventoryService.findByReference(reference);
        return res.status(200).json({
            message: "Inventario encontrado con éxito",
            data: inventory
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};