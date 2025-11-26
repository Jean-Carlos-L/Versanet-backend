export class RegisterContractDTO {
    constructor({ customer_id, plan_id, start_date, end_date, equipment_id } = {}) {
        // aceptar aliases y normalizar
        const cid = customer_id ?? null;
        const start = start_date ?? null;
        const end = end_date ?? null;

        if (!cid || !plan_id || !start || !end) {
            throw new Error("Faltan datos requeridos para registrar el contrato.");
        }

        this.cliente_id = String(cid).trim();
        this.plan_id = String(plan_id).trim();

        const startDate = new Date(start);
        const endDate = new Date(end);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            throw new Error("Fechas inválidas para fecha_inicio o fecha_fin.");
        }
        if (startDate >= endDate) {
            throw new Error("fecha_inicio debe ser anterior a fecha_fin.");
        }

        this.fecha_inicio = startDate.toISOString();
        this.fecha_fin = endDate.toISOString();

        this.equipo_id = equipo_id ?? null; 
    }
}