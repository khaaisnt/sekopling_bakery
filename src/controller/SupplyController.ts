import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    errorFormat: "minimal"
})

// Create Supply
const createSupply = async (req: Request, res: Response): Promise<any> => {
    try {
        const supply_date : Date = new Date (req.body.supply_date)
        const supplier_id : number = (req.body.supplier_id)
        const user_id : number = (req.body.user_id)
        const material_id : number = (req.body.material_id)
        const detail_supplies : any[] = req.body.detail_supplies || []

        const userExist = await prisma.user.findUnique({
            where: { id: Number(user_id) }
        });

        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        const newSupply = await prisma.supply.create({
            data: {
                supply_date,
                supplier_id,
                user_id,
                material_id
            }
        });

        detail_supplies.forEach(async (item) => await prisma.detailSupply.create({
            data: {
                supply_id: newSupply.id,
                material_id: item.material_id,
                material_price: item.material_price,
                quantity: item.quantity,
            }
        }))

        return res.status(200).json({
            message: "Supply created successfully",
            data: newSupply
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

// Read Supply
const readSupply = async (req: Request, res: Response): Promise<any> => {
    try {
        const { supplier_id } = req.query;

        const supplies = await prisma.supply.findMany({
            where: {
                supplier_id: supplier_id ? Number(supplier_id) : undefined
            },
            include: {
                detail_supplies: true,
                supplier: true,
                user: true
            }
        });

        res.status(200).json({
            message: "Supplies found",
            data: supplies
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

// Update Supply
const updateSupply = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;
        const { supply_date, supplier_id, user_id, detail_supplies } = req.body;

        const findSupply = await prisma.supply.findFirst({
            where: { id: Number(id) },
            include: { detail_supplies: true }
        });

        if (!findSupply) {
            return res.status(404).json({ message: "Supply not found" });
        }

        const updatedSupply = await prisma.supply.update({
            where: { id: Number(id) },
            data: {
                supply_date: supply_date ? new Date(supply_date) : findSupply.supply_date,
                supplier_id: supplier_id ? Number(supplier_id) : findSupply.supplier_id,
                user_id: user_id ? Number(user_id) : findSupply.user_id,
                detail_supplies: {
                    deleteMany: {}, // Delete all previous details
                    create: detail_supplies.map((detail: any) => ({
                        material_id: detail.material_id,
                        material_price: detail.material_price,
                        quantity: detail.quantity
                    }))
                }
            }
        });

        res.status(200).json({
            message: "Supply updated successfully",
            data: updatedSupply
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

// Delete Supply
const deleteSupply = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        const findSupply = await prisma.supply.findFirst({
            where: { id: Number(id) }
        });

        if (!findSupply) {
            return res.status(404).json({ message: "Supply not found" });
        }

        const deletedSupply = await prisma.supply.delete({
            where: { id: Number(id) }
        });

        res.status(200).json({
            message: "Supply deleted successfully",
            data: deletedSupply
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

export { createSupply, readSupply, updateSupply, deleteSupply };
