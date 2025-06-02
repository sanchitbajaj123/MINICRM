const mongoose = require('mongoose');

// 🔹 Customer Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  totalSpend: {
    type: Number,
    required: true,
  },
  visits: {
    type: Number,
    required: true,
  },
  lastOrderDate: {
    type: Date,
    required: true,
  }
});

// 🔹 Order Schema
const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }
});

// 🔹 Export Models
const Customer = mongoose.model('Customer', customerSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
  Customer,
  Order
};
