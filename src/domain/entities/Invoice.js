class Invoice {
  constructor({
    id,
    customerId,
    contractId,
    invoiceDate,
    amount,
    status,
    payments,
    customer,
    contract,
  }) {
    this.id = id;
    this.customerId = customerId;
    this.contractId = contractId;
    this.invoiceDate = invoiceDate;
    this.amount = amount;
    this.status = status;
    this.payments = payments || [];
    this.customer = customer || null;
    this.contract = contract || null;
  }
}

export default Invoice;
