import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Supply
const createSupply = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            supply_date,
            supplier_id, 
            user_id, 
            detail_supplies 
        } = req.body;

        const newSupply = await prisma.supply.create({
            data: {
                supply_date: new Date(supply_date),
                supplier_id: Number(supplier_id),
                user_id: Number(user_id),
                detail_supplies: {
                    create: detail_supplies.map((detail: any) => ({
                        supplier_id: detail.supplier_id,
                        material_id: detail.material_id,
                        material_price: detail.material_price,
                        quantity: detail.quantity
                    }))
                }
            }
        });

        res.status(200).json({
            message: "Supply created successfully",
            data: newSupply
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

// Read Supply
const readSupply = async (req: Request, res: Response): Promise<void> => {
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
