import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Cake } from "@prisma/client";
import fs from "fs";
import { ROOT_DIRECTORY } from "../config";

const prisma = new PrismaClient({ errorFormat: "minimal" });

// membuat data cake
const createCake = async (req: Request, res: Response) => {
    try {
        const cake_name = req.body.cake_name;
        const cake_price = req.body.cake_price;
        const cake_image = req.body.cake_image;
        const best_before = req.body.best_before;
        const cake_flavour = req.body.cake_flavor;
        const compositions = req.body.composition;

        const newCake = await prisma.cake.create({
            data: {
                cake_name,
                cake_price,
                cake_image,
                best_before,
                cake_flavour,
                compositions,
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
const readCake = async (req: Request, res: Response) => {
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
const updateCake = async (req: Request, res: Response) => {
    try {
        // membaca id cake
        const cake_id = req.params.cake_id;

        // cek ketersediaan cake berdasarkan id
        const findCake = await prisma.cake.findFirst({
            where: { id: Number(cake_id) },
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
            cake_image,
            best_before,
            cake_flavour,
            compositions,
        } = req.body;

        // mengupdate data cake
        const saveCake = await prisma.cake.update({
            where: { id: Number(cake_id) },
            data: {
                cake_name: cake_name ?? findCake.cake_name,
                cake_price: cake_price ? Number(cake_price) : findCake.cake_price,
                cake_image: req.file ? req.file.filename : findCake.cake_image,
                best_before: best_before ? new Date(best_before) : findCake.best_before,
                cake_flavour: cake_flavour ?? findCake.cake_flavour,
                // error
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
const deleteCake = async (req: Request, res: Response) => {
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
    } catch (error) {
        return res.status(500).json(error);
    }
};

export { createCake, readCake, updateCake, deleteCake };
