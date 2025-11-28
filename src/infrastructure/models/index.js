import { UserModel } from "./userModel.js";
import { RoleModel } from "./roleModel.js";
import { PermissionModel } from "./permissionModel.js";
import { CustomerModel } from "./customerModel.js";
import { RolePermissionModel } from "./rolePermissionModel.js";
import { InventoryModel } from "./inventoryModel.js";
import { ActivityLogModel } from "./activityLogModel.js";
import { ContractModel } from "./contractModel.js";
import { PlanModel } from "./planModel.js";
import { InvoiceModel } from "./invoiceModel.js";
import { PaymentModel } from "./paymentModel.js";

RoleModel.belongsToMany(PermissionModel, {
  through: RolePermissionModel,
  foreignKey: "rol_id",
  otherKey: "permiso_id",
  as: "permissions",
});

PermissionModel.belongsToMany(RoleModel, {
  through: RolePermissionModel,
  foreignKey: "permiso_id",
  otherKey: "rol_id",
  as: "roles",
});

UserModel.belongsTo(RoleModel, {
  foreignKey: "rol_id",
  as: "role",
  targetKey: "id",
});

RoleModel.hasMany(UserModel, {
  foreignKey: "rol_id",
  as: "users",
  sourceKey: "id",
});

CustomerModel.hasMany(ContractModel, {
  foreignKey: "cliente_id",
  as: "contracts",
  sourceKey: "id",
});

ContractModel.belongsTo(CustomerModel, {
  foreignKey: "cliente_id",
  as: "customer",
  targetKey: "id",
});

ContractModel.belongsTo(PlanModel, {
  foreignKey: "plan_id",
  as: "plan",
  targetKey: "id",
});

PlanModel.hasMany(ContractModel, {
  foreignKey: "plan_id",
  as: "contracts",
  sourceKey: "id",
});

ContractModel.belongsTo(InventoryModel, {
  foreignKey: "equipo_id",
  as: "inventory",
  targetKey: "id",
});

InventoryModel.hasOne(ContractModel, {
  foreignKey: "equipo_id",
  as: "contract",
  targetKey: "id",
});

InvoiceModel.belongsTo(ContractModel, {
  foreignKey: "contrato_id",
  as: "contract",
  targetKey: "id",
});

ContractModel.hasMany(InvoiceModel, {
  foreignKey: "contrato_id",
  as: "invoices",
  sourceKey: "id",
});

PaymentModel.belongsTo(InvoiceModel, {
  foreignKey: "factura_id",
  as: "invoice",
  targetKey: "id",
});

InvoiceModel.hasMany(PaymentModel, {
  foreignKey: "factura_id",
  as: "payments",
  sourceKey: "id",
});

InvoiceModel.belongsTo(CustomerModel, {
  foreignKey: "cliente_id",
  as: "customer",
  targetKey: "id",
});

CustomerModel.hasMany(InvoiceModel, {
  foreignKey: "cliente_id",
  as: "invoices",
  sourceKey: "id",
});

export { UserModel, RoleModel, PermissionModel, CustomerModel, ContractModel, PaymentModel, InventoryModel, PlanModel, InvoiceModel, RolePermissionModel, ActivityLogModel };
