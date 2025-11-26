class Plan {
  constructor({ id, description, features, price, duration, status }) {
    this.id = id;
    this.description = description;
    this.features = features;
    this.price = price;
    this.duration = duration;
    this.status = status;
  }
}

export default Plan;
