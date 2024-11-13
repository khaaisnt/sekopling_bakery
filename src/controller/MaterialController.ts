import { Request, Response } from "express";
import { PrismaClient, MaterialType } from "@prisma/client";

const prisma = new PrismaClient();

// membuat data material
const createMaterial = async (req: Request, res: Response): Promise<any> => {
    try {
        const material_name : string = req.body.material_name;
        const material_price : number = req.body.material_price;
        const material_type : 'SOLID' | 'LIQUID' | 'POWDER' = req.body.material_type;

        if (!Object.values(MaterialType).includes(material_type)) {
            return res.status(400).json({ message: "Invalid material type" });
        }

        // Menyimpan data material ke database
        const newMaterial = await prisma.material.create({
            data: {
                material_name,
                material_price,
                material_type
            },
        });

        return res.status(200).json({
            message: "Material created successfully",
            data: newMaterial,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
};

// membaca data material
const readMaterial = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search?.toString() || "";

        // Membaca data dari database
        const allMaterial = await prisma.material.findMany({
            where: {
                material_name: { contains: search },
            },
            include: {
                compositions: true,
                detail_supplies: true,
            },
        });

        return res.status(200).json({
            message: "Materials found",
            data: allMaterial,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error});
    }
};

// mengupdate data material
const updateMaterial = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id
        
        // Mencari material berdasarkan id
        const findMaterial = await prisma.material.findUnique({
            where: {id: Number(id)},
        });

        if (!findMaterial) {
            return res.status(404).json({ message: "Material not found" });
        }

        const { material_name, material_price, material_type } = req.body;

        // Update data material
        const updatedMaterial = await prisma.material.update({
            where: { id: Number(id) },
            data: {
                material_name: material_name ?? findMaterial.material_name,
                material_price: material_price ?? findMaterial.material_price,
                material_type: material_type ?? findMaterial.material_type,
            },
        });

        return res.status(200).json({
            message: "Material updated successfully",
            data: updatedMaterial,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error});
    }
};

// menghapus data material
const deleteMaterial = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        // Mencari material berdasarkan id
        const findMaterial = await prisma.material.findUnique({
            where: { id: Number(id) },
        });

        if (!findMaterial) {
            return res.status(404).json({ message: "Material not found" });
        }

        // Menghapus data material
        await prisma.material.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({
            message: "Material deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error});
    }
};

export { createMaterial, readMaterial, updateMaterial, deleteMaterial };
