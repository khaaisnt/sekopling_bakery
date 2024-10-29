import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const createSupllier = async (req: Request, res: Response): Promise<void> => {
    try {
        const supplier_name: string = req.body.supplier_name;
        const supplier_address: string = req.body.supplier_address;
        const supplier_phone: number = Number (req.body.supplier_phone);

        const newSupplier = await prisma.supplier.create({
            data: {
                supplier_name,
                supplier_address,
                supplier_phone,
            }
        });

        res.status(200).json({
            message: "Supplier created successfully",
            data: newSupplier
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
};

const readSupllier = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search
        const allSupplier = await prisma.supplier.findMany({
            where: {
                OR: [{ supplier_name: { contains: search?.toString() || "" } }],
            }
        })
        return res.status(200).json({
            message: "Supplier found",
            data: allSupplier
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const updateSupplier = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id
        
        const findSupplier = await prisma.supplier.findFirst({
            where:{id: Number(id)}
        })

        if(!findSupplier){
            return res.status(200).json({
                message: "Supplier not found"
            })
        }

        const {
            supplier_name,
            supplier_address,
            supplier_phone,
        } = req.body

        const saveSupplier = await prisma.supplier.update({
            where: {id: Number(id)},
            data:{
                supplier_name: supplier_name ?? findSupplier.supplier_name,
                supplier_address: supplier_address ?? findSupplier.supplier_address,
                supplier_phone: supplier_phone ?? findSupplier.supplier_phone,
                // supplies: supplies ?? findSupplier.supplies
            }
        })

        return res.status(200).json({
            message: "Supplier updated successfully",
            data: saveSupplier
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const deleteSupplier = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const findSupplier = await prisma.supplier.findFirst({
            where: {id: Number(id)}
        })

        if(!findSupplier){
            return res.status(200).json({
                message: "Supplier not found"
            })
        }

        const deleteSupplier = await prisma.supplier.delete({
            where: {id: Number(id)}
        })

        return res.status(200).json({
            message: "Supplier deleted successfully",
            data: deleteSupplier
        })

    } catch (error) {
        return res.status(500).json(error)
    }
}

export { createSupllier, readSupllier, updateSupplier, deleteSupplier }