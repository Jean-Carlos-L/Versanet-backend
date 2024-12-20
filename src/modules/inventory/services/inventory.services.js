import { InventoryRepository } from "../repositories/inventory.repository.js";
import {
  inventoryAdapterDTO,
  inventoryAdapterEntity,
} from "../adapter/inventory.adapter.js";

export class InventoryService {
  static async findAll(filters) {
    try {
      const inventory = await InventoryRepository.findAll(filters);
      return inventory.map((inventory) => inventoryAdapterDTO(inventory));
    } catch (error) {
      console.error("Error al obtener el inventario", error.message);
      throw new Error(error.message);
    }
  }

  static async countInventories(filters) {
    try {
      const total = await InventoryRepository.countInventories(filters);
      return total;
    } catch (error) {
      console.error("Error al obtener el total de inventarios", error.message);
      throw new Error(error.message);
    }
  }

  static async create(inventory) {
    try {
      const inventoryExiste = await InventoryRepository.findByExist(
        inventory.ip,
        inventory.mac,
        inventory.reference
      );
      if (!inventoryExiste) {
        return await InventoryRepository.create(
          inventoryAdapterEntity(inventory)
        );
      }
      throw new Error(
        "La dirección IP, MAC o referencia ya se encuentra registrada"
      );
    } catch (error) {
      console.error("Error al crear el inventario:", error.message);
      throw new Error(error.message);
    }
  }

  static async update(id, inventory) {
    try {
      await InventoryRepository.update(id, inventoryAdapterEntity(inventory));
    } catch (error) {
      console.error("Error al actualizar el inventario", error.message);
      throw new Error(error.message);
    }
  }
  static async findById(id) {
    try {
      const inventory = await InventoryRepository.findById(id);
      if (!inventory) {
        throw new Error("Inventario no encontrado");
      }
      return inventoryAdapterDTO(inventory);
    } catch (error) {
      console.error("Error al obtener el inventario", error.message);
      throw new Error(error.message);
    }
  }
  static async delete(id) {
    try {
      await InventoryRepository.delete(id);
    } catch (error) {
      console.error("Error al eliminar el inventario", error);
      throw new Error("Error al eliminar el inventario");
    }
  }
  static async findByReference(reference) {
    try {
      const inventory = await InventoryRepository.findByReference(reference);
      if (!inventory) {
        throw new Error("Referencia no encontrada en el inventario");
      }
      return inventoryAdapterDTO(inventory);
    } catch (error) {
      console.error("Error al obtener el inventario", error.message);
      throw new Error(error.message);
    }
  }
}
