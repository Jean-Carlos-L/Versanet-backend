class Customer {
    constructor(id, name, document, email, phone, address, status, contracts) {
        this.id = id;
        this.name = name;
        this.document = document;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.status = status || 'active';
        this.contracts = contracts || [];
    }
}

export default Customer;