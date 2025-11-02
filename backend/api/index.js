const express = require("express");
const cors = require("cors");
const app = express();

// Routes Import
const invoicesRouter = require('../routes/invoices.js');
const fileUploadRouter = require('../routes/file-upload.js');
const productsRouter = require('../routes/products.js');
const customersRouter = require('../routes/customers.js');
const homeRouter = require('../routes/home.js');
const customerUpdate = require('../routes/customer-update.js');

// CORS options
const corsOptions = {
  origin: ["https://swipe-invoice-management-frontend.vercel.app", "http://localhost:3000", "https://invoice-management-system-mu.vercel.app"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());


// Routes
app.use('/invoices', invoicesRouter);
app.use('/file-upload', fileUploadRouter);
app.use('/products', productsRouter);
app.use('/customers', customersRouter);
app.use("/", homeRouter);
app.use("/customer-update", customerUpdate);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;
