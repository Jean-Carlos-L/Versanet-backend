import { query } from "../../../common/utils/query.utils.js";

export class PaymentRepository {
  static table = "pagos";

  static async create(payment) {
    const sql = `
      INSERT INTO ${this.table} 
      (id, idCliente, idFactura,  metodo_pago, fecha_pago, monto_pagado, estado) 
      VALUES (UUID(), ?, ?, ?, ?, ?, 1)
    `;
    const params = [
      payment.idCliente,
      payment.idFactura,
      payment.metodo_pago,
      payment.fecha_pago,
      payment.monto_pagado,
    ];
    console.log("params", params);

    const row = await query(sql, params);
    return row;
  }
}
