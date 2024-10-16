import express from "express";
import CakeRouter from "./router/CakeRouter";
import MaterialRouter from "./router/MaterialRouter";

const app = express();

app.use(express.json());

app.use(`/cake`, CakeRouter);

app.use(`/material`, MaterialRouter);

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});
