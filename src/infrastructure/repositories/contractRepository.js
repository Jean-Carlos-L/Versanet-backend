import ContractEntity from "../../domain/entities/Contract.js";
import {
  ContractModel,
  CustomerModel,
  PlanModel,
  InventoryModel,
} from "../models/index.js";
import { Op } from "sequelize";
import ActivityLogRepository from "./activityLogRepository.js";

export class ContractRepository {
  async create(contractData, actor = null, options = {}) {
    const createOpts = {};
    if (options.transaction) createOpts.transaction = options.transaction;
    // Normalizar posibles claves: cliente_id (es) o customer_id (en)
    const clienteId =
      contractData.cliente_id ?? contractData.customer_id ?? null;

    const contractRecord = await ContractModel.create(
      {
        id: contractData.id,
        cliente_id: clienteId,
        plan_id: contractData.plan_id,
        fecha_inicio: contractData.fecha_inicio,
        fecha_fin: contractData.fecha_fin,
        equipo_id: contractData.equipo_id,
        estado: contractData.estado,
        eliminado: contractData.eliminado,
      },
      createOpts
    );
    return new ContractEntity({
      id: contractRecord.id,
      cliente_id: contractRecord.cliente_id,
      plan_id: contractRecord.plan_id,
      fecha_inicio: contractRecord.fecha_inicio,
      fecha_fin: contractRecord.fecha_fin,
      equipo_id: contractRecord.equipo_id,
      estado: contractRecord.estado,
      eliminado: contractRecord.eliminado,
      createdAt: contractRecord.createdAt,
      updatedAt: contractRecord.updatedAt,
    });
  }

  // Lista paginada con filtros básicos
  async list({ filters = {}, offset = 0, limit = 10 } = {}) {
    // use imported Op from sequelize
    const where = { eliminado: false };

    const id = filters.id ?? null;
    const clienteId =
      filters.cliente_id ?? filters.customer_id ?? filters.clienteId ?? null;
    const planId = filters.plan_id ?? filters.planId ?? null;
    const estado = filters.estado ?? null;

    if (id) where.id = id;
    if (clienteId) where.cliente_id = clienteId;
    if (planId) where.plan_id = planId;
    if (estado != null) where.estado = estado;

    const rows = await ContractModel.findAll({
      where,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["eliminado"] },
      include: [
        {
          model: CustomerModel,
          as: "customer",
          attributes: { exclude: ["eliminado"] },
        },
        {
          model: PlanModel,
          as: "plan",
          attributes: { exclude: ["eliminado"] },
        },
        {
          model: InventoryModel,
          as: "inventory",
          attributes: { exclude: ["eliminado"] },
        },
      ],
    });

    return rows.map(
      (r) =>
        new ContractEntity({
          id: r.id,
          cliente_id: r.cliente_id,
          plan_id: r.plan_id,
          fecha_inicio: r.fecha_inicio,
          fecha_fin: r.fecha_fin,
          equipo_id: r.equipo_id,
          estado: r.estado,
          eliminado: r.eliminado,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          customer: r.customer
            ? {
                id: r.customer.id,
                name: r.customer.nombres,
                document: r.customer.cedula,
                email: r.customer.correo_electronico,
                phone: r.customer.telefono,
                address: r.customer.direccion,
                status: r.customer.estado,
              }
            : null,
          plan: r.plan
            ? {
                id: r.plan.id,
                description: r.plan.descripcion,
                features: r.plan.caracateristicas,
                price: r.plan.precio,
                durationMonths: r.plan.duracionMeses,
                status: r.plan.estado,
              }
            : null,
          inventory: r.inventory
            ? {
                id: r.inventory.id,
                reference: r.inventory.referencia,
                network_address: r.inventory.direccion_red,
                type: r.inventory.tipo_equipo,
                quantity: r.inventory.cantidad,
                status: r.inventory.estado,
              }
            : null,
        })
    );
  }

  // Lista paginada con conteo y filtros avanzados (incluye filtros sobre relaciones)
  async findAndCountAll({ filters = {}, offset = 0, limit = 10 } = {}) {
    // use imported Op from sequelize
    const where = { eliminado: false };

    // Contract-level filters
    const id = filters.id ?? null;
    const clienteId =
      filters.cliente_id ?? filters.customer_id ?? filters.clienteId ?? null;
    const planId = filters.plan_id ?? filters.planId ?? null;
    const estado = filters.estado ?? null;

    if (id) where.id = id;
    if (clienteId) where.cliente_id = clienteId;
    if (planId) where.plan_id = planId;
    if (estado != null) where.estado = estado;

    // Date range filter on fecha_inicio
    if (
      filters.date_from ||
      filters.date_to ||
      filters.fecha_desde ||
      filters.fecha_hasta
    ) {
      const from = filters.date_from ?? filters.fecha_desde ?? null;
      const to = filters.date_to ?? filters.fecha_hasta ?? null;
      if (from && to) {
        where.fecha_inicio = { [Op.between]: [new Date(from), new Date(to)] };
      } else if (from) {
        where.fecha_inicio = { [Op.gte]: new Date(from) };
      } else if (to) {
        where.fecha_inicio = { [Op.lte]: new Date(to) };
      }
    }

    const include = [];

    const customerName =
      filters.customer_name ?? filters.name ?? filters.nombres ?? null;
    const customerDocument =
      filters.customer_document ?? filters.cedula ?? filters.document ?? null;
    const sequelize = ContractModel.sequelize;
    const customerConds = [];
    if (customerName) {
      customerConds.push(
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("customer.nombres")),
          { [Op.like]: `%${String(customerName).toLowerCase()}%` }
        )
      );
    }
    if (customerDocument) {
      customerConds.push(
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("customer.cedula")),
          { [Op.like]: `%${String(customerDocument).toLowerCase()}%` }
        )
      );
    }
    if (customerConds.length > 0) {
      include.push({
        model: CustomerModel,
        as: "customer",
        where: { [Op.and]: customerConds, eliminado: false },
        attributes: { exclude: ["eliminado"] },
      });
    } else {
      include.push({
        model: CustomerModel,
        as: "customer",
        attributes: { exclude: ["eliminado"] },
      });
    }

    const planName =
      filters.plan ?? filters.plan_name ?? filters.descripcion ?? null;
    if (planName) {
      const planCond = sequelize.where(
        sequelize.fn("LOWER", sequelize.col("plan.descripcion")),
        { [Op.like]: `%${String(planName).toLowerCase()}%` }
      );
      include.push({
        model: PlanModel,
        as: "plan",
        where: { [Op.and]: [planCond], eliminado: false },
        attributes: { exclude: ["eliminado"] },
      });
    } else {
      include.push({
        model: PlanModel,
        as: "plan",
        attributes: { exclude: ["eliminado"] },
      });
    }

    include.push({
      model: InventoryModel,
      as: "inventory",
      attributes: { exclude: ["eliminado"] },
    });
    const result = await ContractModel.findAndCountAll({
      where,
      include,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      distinct: true,
      attributes: { exclude: ["eliminado"] },
    });

    // Map rows to entities
    const rows = result.rows.map(
      (r) =>
        new ContractEntity({
          id: r.id,
          cliente_id: r.cliente_id,
          plan_id: r.plan_id,
          fecha_inicio: r.fecha_inicio,
          fecha_fin: r.fecha_fin,
          equipo_id: r.equipo_id,
          estado: r.estado,
          eliminado: r.eliminado,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          customer: r.customer
            ? {
                id: r.customer.id,
                name: r.customer.nombres,
                document: r.customer.cedula,
                email: r.customer.correo_electronico,
                phone: r.customer.telefono,
                address: r.customer.direccion,
                status: r.customer.estado,
              }
            : null,
          plan: r.plan
            ? {
                id: r.plan.id,
                description: r.plan.descripcion,
                features: r.plan.caracateristicas,
                price: r.plan.precio,
                durationMonths: r.plan.duracionMeses,
                status: r.plan.estado,
              }
            : null,
          inventory: r.inventory
            ? {
                id: r.inventory.id,
                reference: r.inventory.referencia,
                network_address: r.inventory.direccion_red,
                type: r.inventory.tipo_equipo,
                quantity: r.inventory.cantidad,
                status: r.inventory.estado,
              }
            : null,
        })
    );

    return { rows, count: result.count };
  }

  async findById(id) {
    if (!id) return null;
    const r = await ContractModel.findOne({
      where: { id: id, eliminado: false },
      attributes: { exclude: ["eliminado"] },
      include: [
        {
          model: CustomerModel,
          as: "customer",
          attributes: { exclude: ["eliminado"] },
          required: false,
        },
        {
          model: PlanModel,
          as: "plan",
          attributes: { exclude: ["eliminado"] },
          required: false,
        },
        {
          model: InventoryModel,
          as: "inventory",
          attributes: { exclude: ["eliminado"] },
          required: false,
        },
      ],
    });
    if (!r) return null;

    return new ContractEntity({
      id: r.id,
      cliente_id: r.cliente_id,
      plan_id: r.plan_id,
      fecha_inicio: r.fecha_inicio,
      fecha_fin: r.fecha_fin,
      equipo_id: r.equipo_id,
      estado: r.estado,
      eliminado: r.eliminado,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      customer: r.customer
        ? {
            id: r.customer.id,
            name: r.customer.nombres,
            document: r.customer.cedula,
            email: r.customer.correo_electronico,
            phone: r.customer.telefono,
            address: r.customer.direccion,
            status: r.customer.estado,
          }
        : null,
      plan: r.plan
        ? {
            id: r.plan.id,
            description: r.plan.descripcion,
            features: r.plan.caracateristicas,
            price: r.plan.precio,
            durationMonths: r.plan.duracionMeses,
            status: r.plan.estado,
          }
        : null,
      inventory: r.inventory
        ? {
            id: r.inventory.id,
            reference: r.inventory.referencia,
            network_address: r.inventory.direccion_red,
            type: r.inventory.tipo_equipo,
            quantity: r.inventory.cantidad,
            status: r.inventory.estado,
          }
        : null,
    });
  }

  async update(id, data, actor = null, options = {}) {
   const updateOpts = {};
   if (options.transaction) updateOpts.transaction = options.transaction;

   const contractRecord = await ContractModel.findByPk(id);
    if (!contractRecord) {
     throw new Error("Contract not found");
    }
    contractRecord.cliente_id = data.customer_id;
    contractRecord.plan_id = data.plan_id;
    contractRecord.fecha_inicio = data.start_date;
    contractRecord.fecha_fin = data.end_date;
    contractRecord.equipo_id = data.inventory_id;
    contractRecord.estado = data.status !== undefined ? data.status : contractRecord.estado;

    await contractRecord.save(updateOpts);

    // Audit
    try {
      if (actor) {
        const actorName = actor.nombres || actor.name || actor.email || null;
        const details = `Contrato actualizado: id=${id}, estado=${contractRecord.estado}`;
        await ActivityLogRepository.create({
          actor_id: actor.id || null,
          actor_name: actorName,
          action: "update",
          entity: "contract",
          entity_id: id,
          details,
        }, { transaction: options.transaction });
      }
    } catch (e) {
      console.error('Activity log (contract update) failed:', e && e.message ? e.message : e);
    }
    return new ContractEntity({
      id: contractRecord.id,
      cliente_id: contractRecord.cliente_id,
      plan_id: contractRecord.plan_id,
      fecha_inicio: contractRecord.fecha_inicio,
      fecha_fin: contractRecord.fecha_fin,
      equipo_id: contractRecord.equipo_id,
      estado: contractRecord.estado,
      eliminado: contractRecord.eliminado,
      createdAt: contractRecord.createdAt,
      updatedAt: contractRecord.updatedAt,
    });
  }

  async toggleStatus(id, actor = null, options = {}) {
    const contractRecord = await ContractModel.findByPk(id);
    if (!contractRecord) {
      throw new Error("Contract not found");
    }

    contractRecord.estado = contractRecord.estado === "activo" ? "inactivo" : "activo";
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;
    await contractRecord.save(updateOpts);

    try {
      if (actor) {
        const actorName = actor.nombres || actor.name || actor.email || null;
        const details = `Contrato cambió estado a: ${contractRecord.estado}`;
        await ActivityLogRepository.create({
          actor_id: actor.id || null,
          actor_name: actorName,
          action: "toggle-status",
          entity: "contract",
          entity_id: id,
          details,
        }, { transaction: options.transaction });
      }
    } catch (e) {
      console.error('Activity log (contract toggle) failed:', e && e.message ? e.message : e);
    }

    return new ContractEntity({
      id: contractRecord.id,
      cliente_id: contractRecord.cliente_id,
      plan_id: contractRecord.plan_id,
      fecha_inicio: contractRecord.fecha_inicio,
      fecha_fin: contractRecord.fecha_fin,
      equipo_id: contractRecord.equipo_id,
      estado: contractRecord.estado,
      eliminado: contractRecord.eliminado,
      createdAt: contractRecord.createdAt,
      updatedAt: contractRecord.updatedAt,
    });
  }

  async softDelete(id, actor = null, options = {}) {
    if (!id) return false;
    const instance = await ContractModel.findOne({
      where: { id: id, eliminado: false },
    });
    if (!instance) return false;
    instance.eliminado = true;
    instance.updatedAt = new Date();
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;
    await instance.save(updateOpts);
    // Audit delete
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || null;
      const details = `Contrato eliminado: id=${instance.id}`;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "contract",
        entity_id: instance.id,
        details,
      }, { transaction: options.transaction });
    } catch (e) {
      console.error('Activity log (contract delete) failed:', e && e.message ? e.message : e);
    }
    return true;
  }

  async count({ filters = {} } = {}) {
    const where = { eliminado: false };
    const id = filters.id ?? null;
    const clienteId =
      filters.cliente_id ?? filters.customer_id ?? filters.clienteId ?? null;
    const planId = filters.plan_id ?? filters.planId ?? null;
    const estado = filters.estado ?? null;

    if (id) where.id = id;
    if (clienteId) where.cliente_id = clienteId;
    if (planId) where.plan_id = planId;
    if (estado != null) where.estado = estado;

    console.log("ContractRepository.count - where:", where);

    return await ContractModel.count({ where });
  }
}
