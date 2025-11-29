import PaymentEntity from "../../domain/entities/Payment.js";
import { InvoiceModel } from "../models/invoiceModel.js";
import { PaymentModel } from "../models/paymentModel.js";

export class PaymentRepository {
  async create(paymentData) {
    const paymentRecord = await PaymentModel.create({
      monto: paymentData.amount,
      fecha_pago: paymentData.paymentDate,
      metodo_pago: paymentData.method,
      estado: paymentData.status,
      factura_id: paymentData.invoiceId,
    });
    return new PaymentEntity({
      id: paymentRecord.id,
      amount: paymentRecord.monto,
      paymentDate: paymentRecord.fecha_pago,
      method: paymentRecord.metodo_pago,
      status: paymentRecord.estado,
      invoiceId: paymentRecord.factura_id,
    });
  }

  async update(paymentId, paymentData) {
    const paymentRecord = await PaymentModel.findByPk(paymentId);
    if (!paymentRecord) {
      throw new Error("Payment not found");
    }
    paymentRecord.monto = paymentData.amount;
    paymentRecord.fecha_pago = paymentData.paymentDate;
    paymentRecord.metodo_pago = paymentData.method;
    paymentRecord.estado = paymentData.status;
    paymentRecord.factura_id = paymentData.invoiceId;

    await paymentRecord.save();
    return new PaymentEntity({
      id: paymentRecord.id,
      amount: paymentRecord.monto,
      paymentDate: paymentRecord.fecha_pago,
      method: paymentRecord.metodo_pago,
      status: paymentRecord.estado,
      invoiceId: paymentRecord.factura_id,
    });
  }

  async findById(paymentId) {
    const paymentRecord = await PaymentModel.findOne({
      where: { id: paymentId },
      include: [
        {
          model: InvoiceModel,
          as: "invoice",
        },
      ],
    });
    if (!paymentRecord) {
      throw new Error("Payment not found");
    }
    return new PaymentEntity({
      id: paymentRecord.id,
      amount: paymentRecord.monto,
      paymentDate: paymentRecord.fecha_pago,
      method: paymentRecord.metodo_pago,
      status: paymentRecord.estado,
      invoiceId: paymentRecord.factura_id,
      invoice: {
        id: paymentRecord.invoice.id,
        totalAmount: paymentRecord.invoice.monto,
        dueDate: paymentRecord.invoice.fecha_vencimiento,
        status: paymentRecord.invoice.estado,
        customerId: paymentRecord.invoice.cliente_id,
      },
    });
  }

  async findAll({ filters = {} } = {}) {
    const paymentRecords = await PaymentModel.findAll({
      where: { ...filters },
      include: [
        {
          model: InvoiceModel,
          as: "invoice",
        },
      ],
    });
    return paymentRecords.map(
      (paymentRecord) =>
        new PaymentEntity({
          id: paymentRecord.id,
          amount: paymentRecord.monto,
          paymentDate: paymentRecord.fecha_pago,
          method: paymentRecord.metodo_pago,
          status: paymentRecord.estado,
          invoiceId: paymentRecord.factura_id,
          invoice: {
            id: paymentRecord.invoice.id,
            customerId: paymentRecord.invoice.cliente_id,
            contractId: paymentRecord.invoice.contrato_id,
            dueDate: paymentRecord.invoice.fecha_facturacion,
            totalAmount: paymentRecord.invoice.monto,
            status: paymentRecord.invoice.estado,
          },
        })
    );
  }

  async findByInvoiceId(invoiceId) {
    const paymentRecords = await PaymentModel.findAll({
      where: { factura_id: invoiceId, eliminado: false },
      include: [
        {
          model: InvoiceModel,
          as: "invoice",
        },
      ],
    });
    return paymentRecords.map(
      (paymentRecord) =>
        new PaymentEntity({
          id: paymentRecord.id,
          amount: paymentRecord.monto,
          paymentDate: paymentRecord.fecha_pago,
          method: paymentRecord.metodo_pago,
          status: paymentRecord.estado,
          invoiceId: paymentRecord.factura_id,
          invoice: {
            id: paymentRecord.invoice.id,
            customerId: paymentRecord.invoice.cliente_id,
            contractId: paymentRecord.invoice.contrato_id,
            dueDate: paymentRecord.invoice.fecha_facturacion,
            totalAmount: paymentRecord.invoice.monto,
            status: paymentRecord.invoice.estado,
          },
        })
    );
  }

  async delete(paymentId) {
    const paymentRecord = await PaymentModel.findByPk(paymentId);
    if (!paymentRecord) {
      throw new Error("Payment not found");
    }

    const deletedRowsCount = await PaymentModel.update(
      { eliminado: true },
      { where: { id: paymentId } }
    );
    return deletedRowsCount > 0;
  }

  async count({ filters = {} } = {}) {
    const count = await PaymentModel.count({
      where: { ...filters },
    });
    return count;
  }

  async sumTotalAmountByInvoice(invoiceId, filters = {}) {
    const where = { eliminado: false, factura_id: invoiceId };
    if (filters.status) {
      where.estado = filters.status;
    }

    const result = await PaymentModel.findAll({
      where,
      attributes: [
        [
          PaymentModel.sequelize.fn("SUM", PaymentModel.sequelize.col("monto")),
          "totalAmount",
        ],
      ],
      raw: true,
    });
    return parseFloat(result[0].totalAmount) || 0;
  }
}
