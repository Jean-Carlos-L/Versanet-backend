import { RoleRepository} from "../repositories/role.repository.js";
import { roleAdapterDTO, roleAdapterEntity } from "../adapters/role.adapter.js";
import { deleteRole } from "../controllers/role.controller.js";

export class RoleService {
      
     static async createRole(role){
          try {
            await RoleRepository.createRole(roleAdapterEntity(role));
            //mandamos un mensaje de exito
            message("Rol creado con exito");
          } catch (error) {
                throw new Error("Error al crear el rol");
          }         
     }
    
     static async updateRole(role){
          try {
                await RoleRepository.updateRol(roleAdapterEntity(role));
          } catch (error) {
                throw new Error("Error al actualizar el rol");
          }
     }
    
     static async findById(id){
          try {
            const role= await RoleRepository.findById(id);
            message("Rol encontrado con exito");
          } catch (error) {
                throw new Error("Error al obtener el rol");
          }
          return roleAdapterDTO(role);
     }
    
     static async findAll(){
          try {
                const roles=  await RoleRepository.findAll();
                return roles.map(role => roleAdapterDTO(role));
          } catch (error) {
                throw new Error("Error al obtener los roles");
          }
     }
    
     static async deleteRol(id){
          try {
                await RoleRepository.deleteRol(id);
          } catch (error) {
                throw new Error("Error al eliminar el rol");
          }
     }
}

