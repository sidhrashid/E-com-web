const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const userlogin = require("./routes/loginRoute/UserLoginRoute");
const products = require("./routes/pagesRoute/ProductsRoute");
const category = require("./routes/pagesRoute/ProCategoryRoute");
const adminUser = require("./routes/loginRoute/AdminLoginRoute");
const cartItem = require("./routes/pagesRoute/CartItemRoutes");
const paymentRoutes = require("./routes/paymentMethodRoute/PaymentRoute");


const app = express();
const PORT = process.env.PORT;
const URL = process.env.URL;

app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userlogin);
app.use("/", products);
app.use("/", category);
app.use("/", adminUser);
app.use("/", cartItem);
app.use('/', paymentRoutes);

app.use(
  cors({
    origin: "https://e-com-web-1-srky.onrender.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
  })
);


app.listen(PORT, () => {
  console.log(`server is running on port ${URL}`);
});
