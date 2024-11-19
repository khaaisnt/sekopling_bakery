import { Request, Response } from "express";
import { statusType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// membuat data order
const createOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        const order_date: Date = new Date(req.body.order_date);
        const user_id: number = req.body.user_id;
        const status: statusType = req.body.status ;
        const user = req.body.user;
        const detail_orders = req.body.detail_order;

        const newOrder = await prisma.order.create({
            data: {
                order_date,
                user_id,
                status,
                user,
                detail_order: {
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