import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { ROOT_DIRECTORY } from "../config";

const prisma = new PrismaClient();

// membuat data cake
const createCake = async (req: Request, res: Response): Promise<any> => {
    try {
        const cake_name: string = req.body.cake_name;
        const cake_price: number = Number(req.body.cake_price);
        const cake_image: string = req.file?.filename || "";
        const best_before: Date = new Date(req.body.best_before);
        const cake_flavour: string = req.body.cake_flavour;
        const compositions = req.body.compositions;

        const newCake = await prisma.cake.create({
            data: {
                cake_name,
                cake_price,
                cake_image,
                best_before,
                cake_flavour,
                compositions: {
                    create: compositions.map((comp: any) => ({
                        material_id: comp.material_id,
                        quantity: comp.quantity,
                    }))
                },
            },
        });

        return res.status(200).json({
            message: "Cake created successfully",
            data: newCake,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

// membaca data cake
const readCake = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search;
        const allCake = await prisma.cake.findMany({
            where: {
                OR: [{ cake_name: { contains: search?.toString() || "" } }],
            },
        });
        return res.status(200).json({
            message: "Cake found",
            data: allCake,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error });
    }
};

// mengupdate data cake
const updateCake = async (req: Request, res: Response): Promise<any> => {
    try {
        // membaca id cake
        const id = req.params.id;

        // cek ketersediaan cake berdasarkan id
        const findCake = await prisma.cake.findFirst({
            where: { id: Number(id) },
        });

        // jika cake tidak ditemukan
        if (!findCake) {
            return res.status(200).json({
                message: "Cake not found",
            });
        }

        if (req.file) {
            let oldFileName = findCake.cake_image;
            let pathFile = `${ROOT_DIRECTORY}/public/uploads/${oldFileName}`;
            let existFile = fs.existsSync(pathFile);
            if (existFile && oldFileName !== ``) {
                /** delete the old file */
                fs.unlinkSync(pathFile);
            }
        }

        // membaca properti cake dari request body
        const {
            cake_name,
            cake_price,
            best_before,
            cake_flavour,
            compositions,
        } = req.body;

        // mengupdate data cake
        const saveCake = await prisma.cake.update({
            where: { id: Number(id) },
            data: {
                cake_name: cake_name ?? findCake.cake_name,
                cake_price: cake_price ? Number(cake_price) : findCake.cake_price,
                cake_image: req.file ? req.file.filename : findCake.cake_image,
                best_before: best_before ? new Date(best_before) : findCake.best_before,
                cake_flavour: cake_flavour ?? findCake.cake_flavour,
                // compositions: compositions ?? findCake.compositions,
            },
        });

        return res.status(200).json({
            message: "Cake updated successfully",
            data: saveCake,
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

// menghapus data cake
const deleteCake = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        // cek ketersediaan cake berdasarkan id
        const findCake = await prisma.cake.findFirst({
            where: { id: Number(id) },
        });

        // jika cake tidak ditemukan
        if (!findCake) {
            return res.status(200).json({
                message: "Cake not found",
            });
        }

        let oldFileName = findCake.cake_image;
        let pathFile = `${ROOT_DIRECTORY}/public/uploads/${oldFileName}`;
        let existFile = fs.existsSync(pathFile);
        if (existFile && oldFileName !== ``) {
            /** delete the old file */
            fs.unlinkSync(pathFile);
        }

        // menghapus data cake
        const deleteCake = await prisma.cake.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({
            message: "Cake deleted successfully",
            data: deleteCake,
        });

    } catch (error) {
        return res.status(500).json(error);
    }
};

export { createCake, readCake, updateCake, deleteCake };
