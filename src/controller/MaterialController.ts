import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "minimal" });

// membuat data material
const createMaterial = async (req: Request, res: Response): Promise<any> => {
    try {
        const material_name = req.body.material_name;
        const material_price = req.body.material_price;
        const material_type = req.body.material_type;
        const compositions = req.body.compositions;
        const detail_supplies = req.body.detail_supplies;

        // menyimpan data material ke database
        const newMaterial = await prisma.material.create({
            data: {
                material_name,
                material_price,
                material_type,
                compositions,
                detail_supplies,
            },
        });

        return res.status(200).json({
            message: "Material created successfully",
            data: newMaterial,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error });
    }
}

// membaca data material
const readMaterial = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search;
        const allMaterial = await prisma.material.findMany({
            where: {
                OR: [{ material_name: { contains: search?.toString() || "" } }],
            },
        });
        return res.status(200).json({
            message: "Material found",
            data: allMaterial,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error });
    }
};

// mengupdate data material
const updateMaterial = async (req: Request, res: Response):Promise<any> => {
    try {
        const material_id = req.params.material_id;

        const findMaterial = await prisma.material.findFirst({
            where: {id: Number(material_id)}
        })

        if (!findMaterial) {
            return res.status(404).json({
                message: "Material not found"
            })
        }

        const{
            material_name,
            material_price,
            material_type,
            compositions,
            detail_supplies
        } = req.body;

        // update data material
        const saveMaterial = await prisma.material.update({
            where: {id: Number(material_id)},
            data: {
                material_name: material_name ?? findMaterial.material_name,
                material_price: material_price ?? findMaterial.material_price,
                material_type: material_type ?? findMaterial.material_type,
                // compositions: compositions ?? findMaterial.compositions,
                // detail_supplies: detail_supplies ?? findMaterial.detail_supplies
            }
        })

        return res.status(200).json({
            message: "Material updated successfully",
            data: saveMaterial
        })

    } catch (error) {
        return res.status(500).json(error);
    }
}

// hapus data material
const deleteMaterial = async (req: Request, res: Response): Promise<any> => {
    try {
        const material_id = req.params.material_id;

        const findMaterial = await prisma.material.findFirst({
            where: {id: Number(material_id)}
        })

        if (!findMaterial) {
            return res.status(200).json({
                message: "Material not found"
            })
        }

        // hapus data
        await prisma.material.delete({
            where: {id: Number(material_id)}
        })

        return res.status(200).json({
            message: "Material deleted successfully"
        })

    } catch (error) {
        return res.status(500).json(error);
    }
}

export { createMaterial, readMaterial, updateMaterial, deleteMaterial };