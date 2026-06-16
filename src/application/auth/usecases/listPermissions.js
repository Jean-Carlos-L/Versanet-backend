import { PermissionRepository } from "../../../infrastructure/repositories/permissionRepository.js";

const permissionRepository = new PermissionRepository();

export async function listPermissions() {
  const permissions = await permissionRepository.findAll();
  return permissions;
}
