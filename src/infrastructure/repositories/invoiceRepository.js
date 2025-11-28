import InvoiceEntity from "../../domain/entities/Invoice.js";
import CustomerEntity from "../../domain/entities/Customer.js";
import { InvoiceModel } from "../models/invoiceModel.js";
import { CustomerModel } from "../models/customerModel.js";
import { ContractModel } from "../models/contractModel.js";
import { Op } from "sequelize";
import ActivityLogRepository from "./activityLogRepository.js";

export class InvoiceRepository {
  // Helper method to map invoice record with relations to entity
  _mapToEntityWithRelations(invoiceRecord) {
    const customer = invoiceRecord.customer ? new CustomerEntity(
      invoiceRecord.customer.id,
      invoiceRecord.customer.nombres,
      invoiceRecord.customer.cedula,
      invoiceRecord.customer.correo_electronico,
      invoiceRecord.customer.telefono,
      invoiceRecord.customer.direccion,
      invoiceRecord.customer.estado
    ) : null;

    const contract = invoiceRecord.contract ? {
      id: invoiceRecord.contract.id,
      customerId: invoiceRecord.contract.cliente_id,
      planId: invoiceRecord.contract.plan_id,
      startDate: invoiceRecord.contract.fecha_inicio,
      endDate: invoiceRecord.contract.fecha_fin,
      equipmentId: invoiceRecord.contract.equipo_id,
      status: invoiceRecord.contract.estado,
    } : null;

    return new InvoiceEntity({
      id: invoiceRecord.id,
      customerId: invoiceRecord.cliente_id,
      contractId: invoiceRecord.contrato_id,
      invoiceDate: invoiceRecord.fecha_facturacion,
      amount: invoiceRecord.monto,
      status: invoiceRecord.estado,
      customer: customer,
      contract: contract,
    });
  }
  async create(invoiceData, actor = null, options = {}) {
    const createOpts = {};
    if (options.transaction) createOpts.transaction = options.transaction;

    const invoiceRecord = await InvoiceModel.create(
      {
        cliente_id: invoiceData.customerId,
        contrato_id: invoiceData.contractId,
        fecha_facturacion: invoiceData.invoiceDate,
        monto: invoiceData.amount,
        estado: invoiceData.status,
      },
      createOpts
    );

    try {
      if (actor) {
        const actorName = actor.nombres || actor.name || actor.email || null;
        const details = `Factura creada: id=${invoiceRecord.id}, monto=${invoiceRecord.monto}`;
        await ActivityLogRepository.create({
          actor_id: actor.id || null,
          actor_name: actorName,
          action: "create",
          entity: "invoice",
          entity_id: invoiceRecord.id,
          details,
        }, { transaction: options.transaction });
      }
    } catch (e) {
      console.error('Activity log (invoice create) failed:', e && e.message ? e.message : e);
    }

    return new InvoiceEntity({
      id: invoiceRecord.id,
      customerId: invoiceRecord.cliente_id,
      contractId: invoiceRecord.contrato_id,
      invoiceDate: invoiceRecord.fecha_facturacion,
      amount: invoiceRecord.monto,
      status: invoiceRecord.estado,
    });
  }

  async update(invoiceId, invoiceData, actor = null, options = {}) {
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    const invoiceRecord = await InvoiceModel.findByPk(invoiceId);
    if (!invoiceRecord) {
      throw new Error("Invoice not found");
    }
    invoiceRecord.cliente_id = invoiceData.customerId;
    invoiceRecord.contrato_id = invoiceData.contractId;
    invoiceRecord.fecha_facturacion = invoiceData.invoiceDate;
    invoiceRecord.monto = invoiceData.amount;
    invoiceRecord.estado = invoiceData.status;
    await invoiceRecord.save(updateOpts);

    try {
      if (actor) {
        const actorName = actor.nombres || actor.name || actor.email || null;
        const details = `Factura actualizada: id=${invoiceId}, monto=${invoiceRecord.monto}`;
        await ActivityLogRepository.create({
          actor_id: actor.id || null,
          actor_name: actorName,
          action: "update",
          entity: "invoice",
          entity_id: invoiceId,
          details,
        }, { transaction: options.transaction });
      }
    } catch (e) {
      console.error('Activity log (invoice update) failed:', e && e.message ? e.message : e);
    }
    return new InvoiceEntity({
      id: invoiceRecord.id,
      customerId: invoiceRecord.cliente_id,
      contractId: invoiceRecord.contrato_id,
      invoiceDate: invoiceRecord.fecha_facturacion,
      amount: invoiceRecord.monto,
      status: invoiceRecord.estado,
    });
  }

  async findById(invoiceId) {
    const invoiceRecord = await InvoiceModel.findOne({
      where: { id: invoiceId, eliminado: false },
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          required: false
        },
        {
          model: ContractModel,
          as: 'contract',
          required: false
        }
      ]
    });
    if (!invoiceRecord) {
      throw new Error("Invoice not found");
    }
    return this._mapToEntityWithRelations(invoiceRecord);
  }

  async findAll({ filters = {}, offset = 0, limit = 10 } = {}) {
    const { cliente, contrato, minAmount, maxAmount, ...otherFilters } = filters;
    const where = { eliminado: false, ...otherFilters };
    
    // Add amount range filters
    if (minAmount && maxAmount) {
      where.monto = {
        [Op.between]: [minAmount, maxAmount]
      };
    } else if (minAmount) {
      where.monto = {
        [Op.gte]: minAmount
      };
    } else if (maxAmount) {
      where.monto = {
        [Op.lte]: maxAmount
      };
    }
    
    // Prepare includes with conditional where clauses
    const includes = [];
    
    // Customer include with optional filtering
    const customerInclude = {
      model: CustomerModel,
      as: 'customer',
      required: false
    };
    
    if (cliente) {
      customerInclude.required = true; // Use INNER JOIN when filtering
      customerInclude.where = {
        [Op.or]: [
          {
            nombres: {
              [Op.like]: `%${cliente}%`
            }
          },
          {
            cedula: {
              [Op.like]: `%${cliente}%`
            }
          }
        ]
      };
    }
    includes.push(customerInclude);
    
    // Contract include with optional filtering
    const contractInclude = {
      model: ContractModel,
      as: 'contract',
      required: false
    };
    
    if (contrato) {
      contractInclude.required = true; // Use INNER JOIN when filtering
      contractInclude.where = {};
      
      if (contrato.id) {
        contractInclude.where.id = contrato.id;
      }
    }
    includes.push(contractInclude);

    const invoiceRecords = await InvoiceModel.findAll({
      where,
      offset,
      limit,
      include: includes
    });
    return invoiceRecords.map(invoiceRecord => this._mapToEntityWithRelations(invoiceRecord));
  }

  async count({ filters = {} } = {}) {
    const { cliente, contrato, minAmount, maxAmount, ...otherFilters } = filters;
    const where = { eliminado: false, ...otherFilters };
    
    if (minAmount && maxAmount) {
      where.monto = {
        [Op.between]: [minAmount, maxAmount]
      };
    } else if (minAmount) {
      where.monto = {
        [Op.gte]: minAmount
      };
    } else if (maxAmount) {
      where.monto = {
        [Op.lte]: maxAmount
      };
    }
    
    // Prepare includes with conditional where clauses for count
    const includes = [];
    
    // Customer include with optional filtering
    if (cliente) {
      const customerInclude = {
        model: CustomerModel,
        as: 'customer',
        required: true,
        where: {
          [Op.or]: [
            {
              nombres: {
                [Op.like]: `%${cliente}%`
              }
            },
            {
              cedula: {
                [Op.like]: `%${cliente}%`
              }
            }
          ]
        }
      };
      
      includes.push(customerInclude);
    }
    
    // Contract include with optional filtering
    if (contrato) {
      const contractInclude = {
        model: ContractModel,
        as: 'contract',
        required: true,
        where: {}
      };
      
      if (contrato.id) {
        contractInclude.where.id = contrato.id;
      }
      
      includes.push(contractInclude);
    }

    const count = await InvoiceModel.count({ 
      where,
      include: includes.length > 0 ? includes : undefined
    });
    return count;
  }

  async delete(invoiceId, actor = null, options = {}) {
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    const invoiceRecord = await InvoiceModel.findByPk(invoiceId);
    if (!invoiceRecord) {
      throw new Error("Invoice not found");
    }
    invoiceRecord.eliminado = true;
    await invoiceRecord.save(updateOpts);

    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || null;
      const details = `Factura eliminada: id=${invoiceRecord.id}, monto=${invoiceRecord.monto}`;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "invoice",
        entity_id: invoiceRecord.id,
        details,
      }, { transaction: options.transaction });
    } catch (e) {
      console.error('Activity log (invoice delete) failed:', e && e.message ? e.message : e);
    }

    return true;
  }

  async findByCustomerId(customerId) {
    const invoiceRecords = await InvoiceModel.findAll({
      where: { cliente_id: customerId, eliminado: false },
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          required: false
        },
        {
          model: ContractModel,
          as: 'contract',
          required: false
        }
      ]
    });
    return invoiceRecords.map(invoiceRecord => this._mapToEntityWithRelations(invoiceRecord));
  }

  async findByContractId(contractId) {
    const invoiceRecords = await InvoiceModel.findAll({
      where: { contrato_id: contractId, eliminado: false },
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          required: false
        },
        {
          model: ContractModel,
          as: 'contract',
          required: false
        }
      ]
    });
    return invoiceRecords.map(invoiceRecord => this._mapToEntityWithRelations(invoiceRecord));
  }

  async updateStatus(invoiceId, status, actor = null, options = {}) {
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    const invoiceRecord = await InvoiceModel.findByPk(invoiceId, {
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          required: false
        },
        {
          model: ContractModel,
          as: 'contract',
          required: false
        }
      ]
    });
    if (!invoiceRecord) {
      throw new Error("Invoice not found");
    }
    invoiceRecord.estado = status;
    await invoiceRecord.save(updateOpts);

    try {
      if (actor) {
        const actorName = actor.nombres || actor.name || actor.email || null;
        const details = `Factura estado actualizado: id=${invoiceId}, estado=${status}`;
        await ActivityLogRepository.create({
          actor_id: actor.id || null,
          actor_name: actorName,
          action: "update-status",
          entity: "invoice",
          entity_id: invoiceId,
          details,
        }, { transaction: options.transaction });
      }
    } catch (e) {
      console.error('Activity log (invoice status) failed:', e && e.message ? e.message : e);
    }

    return this._mapToEntityWithRelations(invoiceRecord);
  }
}
