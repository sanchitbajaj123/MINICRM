const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require("nodemailer");
require('dotenv').config();
const { Customer, Order } = require('./schema');

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB error:', err));
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS, 
  },
});
// Add Customer
app.post('/save/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/save/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('🚀 Xeno CRM API is running');
});

app.get('/alldata', async (req, res) => {
  try {
    const ordersWithCustomers = await Order.find().populate('customerId');
    res.status(200).json(ordersWithCustomers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/send-campaign", async (req, res) => {
  const { message, recipients } = req.body;

  if (!message || !recipients || recipients.length === 0) {
    return res.status(400).json({ error: "Missing message or recipients" });
  }

  try {
    const mailOptions = {
      from: '"CRM Campaign" <your-email@gmail.com>',
      to: recipients.join(","),
      subject: "Special Offer Just for You!",
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, msg: "Emails sent" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
