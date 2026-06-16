class Inventory {
    constructor({ id, referencia, direccion_red, tipo_equipo, cantidad, estado, eliminado, createdAt, updatedAt }) {
        this.id = id;
        this.referencia = referencia;
        this.direccion_red = direccion_red;
        this.tipo_equipo = tipo_equipo;
        this.cantidad = cantidad;
        this.estado = estado || 'activo';
        this.eliminado = eliminado || false;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Inventory;

