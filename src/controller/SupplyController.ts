import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// membuat data supplier
const createSupply = async (req: Request, res: Response): Promise<any> => {
    try {
        const supply_date: Date = new Date(req.body.supply_date);
        const supplier_id: number = Number(req.body.supplier_id);
        const user_id: number = Number(req.body.user_id);
        const detail_supplies = req.body.detail_supplies;

        // menyimpan data supply ke database
        const newSupply = await prisma.supply.create({
            data: {
                supply_date,
                supplier_id,
                user_id,
                detail_supplies,
            },
        });

        return res.status(200).json({
            message: "Supply created successfully",
            data: newSupply,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
}

// membaca data supply
const readSupply = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search;
        const allSupply = await prisma.supply.findMany({
            where: {
                
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}