import { Router } from "express";
import { createOrder } from "../controller/OrderController";

const router = Router();

router.post(`/`, createOrder);