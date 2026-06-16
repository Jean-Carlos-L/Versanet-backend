class Payment {
  constructor({ id, amount, paymentDate, method, status, invoiceId, invoice }) {
    this.id = id;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.method = method;
    this.status = status;
    this.invoiceId = invoiceId;
    this.invoice = invoice;
  }
}

export default Payment;
