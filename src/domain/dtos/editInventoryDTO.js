export class UpdateInventoryDTO {
    constructor({ referencia, direccion_red, tipo_equipo, cantidad, estado }) {
        // Campos opcionales, pero valida los proporcionados
        if (referencia !== undefined && !referencia.trim()) {
            throw new Error('Referencia no puede estar vacía');
        }
        if (direccion_red !== undefined && !direccion_red.trim()) {
            throw new Error('Dirección de red no puede estar vacía');
        }
        if (tipo_equipo !== undefined) {
            const validTypes = ["router", "switch", "mac", "otros"];
            if (!validTypes.includes(tipo_equipo.trim())) {
                throw new Error(`Tipo de equipo inválido. Valores permitidos: ${validTypes.join(', ')}`);
            }
        }
        if (cantidad !== undefined && (cantidad < 0 || !Number.isInteger(cantidad))) {
            throw new Error('Cantidad debe ser un número entero positivo');
        }
        if(cantidad === 0){
              estado = 'inactivo';
        }
        if (estado !== undefined && !['activo', 'inactivo', 'mantenimiento'].includes(estado.trim())) {
            throw new Error('Estado inválido. Valores permitidos: activo, inactivo, mantenimiento');
        }

        this.referencia = referencia ? referencia.trim() : undefined;
        this.direccion_red = direccion_red ? direccion_red.trim() : undefined;
        this.tipo_equipo = tipo_equipo ? tipo_equipo.trim() : undefined;
        this.cantidad = cantidad;
        this.estado = estado ? estado.trim() : undefined;
    }
}
