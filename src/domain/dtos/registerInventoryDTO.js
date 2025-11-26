export class RegisterInventoryDTO {
    constructor({ referencia, direccion_red, tipo_equipo, cantidad }) {
        if (!referencia || !direccion_red || !tipo_equipo || cantidad == null) {
            throw new Error(`Faltan datos requeridos para registrar el inventario. Los campos que faltan son: ${!referencia ? 'referencia ' : ''}${!direccion_red ? 'direccion_red ' : ''}${!tipo_equipo ? 'tipo_equipo ' : ''}${cantidad == null ? 'cantidad' : ''}`.trim());
        }
        this.referencia = referencia.trim();
        this.direccion_red = direccion_red.trim();
        this.tipo_equipo = tipo_equipo.trim();
        this.cantidad = cantidad;
    }
}
