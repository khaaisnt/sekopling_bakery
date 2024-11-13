import { Request, Response } from "express";
import { OrderStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// membuat data order
const createOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            order_date,
            user_id,
            status,
            user,
            detail_orders
        } = req.body;

        if (!Object.values(OrderStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const newOrder = await prisma.order.create({
            data: {
                order_date,
                user_id,
                status,
                user,
                detail_orders: {
                    create: detail_orders.map((detail: any) => ({
                        cake_id: detail.cake_id,
                        cake_price: detail.cake_price,
                        quantity: detail.quantity,
                    }))
                }
            }
        })

        return res.status(201).json({
            message: "Order created successfully",
            data: newOrder
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
}

// membaca data order
const readOrder = async (res: Response, req: Request): Promise<any> => {
    try {
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
}

export { createOrder };