import express from "express";
import CakeRouter from "./router/CakeRouter";
import MaterialRouter from "./router/MaterialRouter";
import SupplierRouter from "./router/SupplierRouter";
import UserRoter from "./router/UserRouter";
import SupplyRouter from "./router/SupplyRouter";

const app = express();

app.use(express.json());

app.use(`/cake`, CakeRouter);

app.use(`/material`, MaterialRouter);

app.use(`/supplier`, SupplierRouter);

app.use(`/user`, UserRoter);

app.use(`/supply`, SupplyRouter);

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});
