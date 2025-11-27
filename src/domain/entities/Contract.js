class Contract {
	constructor({id, cliente_id, plan_id, fecha_inicio, fecha_fin, equipo_id = null, estado = 'activo', eliminado = false, createdAt = null, updatedAt = null, customer = null, plan = null, inventory = null } = {}) {
		this.id = id;
		this.cliente_id = cliente_id;
		this.plan_id = plan_id;
		this.fecha_inicio = fecha_inicio;
		this.fecha_fin = fecha_fin;
		this.equipo_id = equipo_id; // relación con inventario
		this.estado = estado;
		this.customer = customer;
		this.plan = plan;
		this.inventory = inventory;
		this.eliminado = eliminado;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	isActive() {
		return this.estado === 'activo' && !this.eliminado;
	}

	toJSON() {
		return {
			id: this.id,
			customer_id: this.cliente_id,
			plan_id: this.plan_id,
			start_date: this.fecha_inicio,
			end_date: this.fecha_fin,
			inventory_id: this.equipo_id,
			status: this.estado,
			deleted: this.eliminado,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			customer: this.customer,
			plan: this.plan,
			inventory: this.inventory,
		};
	}
}

export default Contract;
