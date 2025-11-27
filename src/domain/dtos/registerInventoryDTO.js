export class RegisterInventoryDTO {
    constructor({ reference, network_address, type, quantity }) {
        if (!reference || !network_address || !type || quantity == null) {
            throw new Error(`Faltan datos requeridos para registrar el inventario. Los campos que faltan son: ${!reference ? 'reference ' : ''}${!network_address ? 'network_address ' : ''}${!type ? 'type ' : ''}${quantity == null ? 'quantity' : ''}`.trim());
        }
        this.reference = reference.trim();
        this.network_address = network_address.trim();
        this.type = type.trim();
        this.quantity = quantity;
    }
}
