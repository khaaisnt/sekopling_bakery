import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { ROOT_DIRECTORY } from "../config";

const prisma = new PrismaClient({errorFormat: "minimal"})

const createCake = async (
    req: Request,
    res: Response
): Promise<any>  => {
    try {
        const cake_name: string = req.body.cake_name
        const cake_price: number = Number(req.body.cake_price)
        const best_before: Date = new Date(req.body.best_before)
        const cake_flavour: string = req.body.cake_flavour
        const cake_image: string = req.file?.filename || ``
        
        const newCake = await prisma.cake.create({
            data: {
                cake_name,
                cake_price,
                best_before,
                cake_flavour,
                cake_image,
            }
        });
            return res.status(200).json({
            message: "the cake has been made!",
            data: newCake
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            error: error
        })
    }
}

const readCake = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const search = req.query.search
        const allCake = await prisma.cake.findMany({
            where: {
                OR: [
                    {cake_name: {contains: search?.toString() || ""}}
                ]
            }
        })
        return res.status(200).json({
            message: 'cake has been read',
            data: allCake
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateCake = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        //read id 
        const id = req.params.id

        //check existing cake based on id
        const findCake = await prisma.cake.findFirst({
            where: {id: Number(id)}
        })
        if(!findCake){
            return res.status(200).json ({
                message: `cake is not found`
            })
        }

        if(req.file){
    let oldFileName = findCake.cake_image

    let pathFile = `${ROOT_DIRECTORY}/public/bakery-photo/${oldFileName}`
    
    let existFile = fs.existsSync(pathFile)

    if(existFile && oldFileName !== ``){
        fs.unlinkSync(pathFile)
    }
        }

        //** read a property of cake from req.body */
        const {
            cake_name,
            cake_price,
            best_before,
            cake_flavour   
        } = req.body

        //update cake
        const saveCake = await prisma.cake.update({
            where: { id: Number(id) },
            data : {
                cake_name: cake_name ?? findCake.cake_name,
                cake_price: cake_price ?? findCake.cake_price,
                best_before: best_before ?? findCake.best_before,
                cake_flavour: cake_flavour ?? findCake.cake_flavour,
                cake_image: req.file?.filename ?? findCake.cake_image,
            } 
        });
        return res.status(200).json({
            message: "cake update succes",
            data: saveCake
        });
    } catch (error) {
        return res.status(500).json(error)
    }
}

const deleteCake = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const id = req.params.id

        //check existing cake
        const findCake = await prisma.cake.findFirst({
            where: {
                id: Number(id)
            }
        })
    
        if(!findCake){
            return res.status(200)
            .json({message: 'cake is not found'})
        }
        if(req.file){
            let oldFileName = findCake.cake_image
        
            let pathFile = `${ROOT_DIRECTORY}/public/bakery-photo/${oldFileName}`
            
            let existFile = fs.existsSync(pathFile)
        
            if(existFile && oldFileName !== ``){
                fs.unlinkSync(pathFile)
            }
                }
    
        //delete
        const saveCake = await prisma.cake.delete({
            where: {id: Number(id)}
        })
    
        return res.status(200).json({
            message: `cake removed`,
            data: saveCake
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export {createCake, readCake, updateCake, deleteCake}