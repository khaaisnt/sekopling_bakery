import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// membuat data user
const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const user_name = req.body.user_name;
        const user_email = req.body.user_email;
        const user_password = req.body.user_password;
        const user_role = req.body.user_role;
        
        const newUser = await prisma.user.create({
            data: {
                user_name,
                user_email,
                user_password,
                user_role,
            },
        })

        return res.status(200).json({
            message: "User created successfully",
            data: newUser,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
}

// membaca data user
const readUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search;
        const allUser = await prisma.user.findMany({
            where: {
                OR: [{ user_name: { contains: search?.toString() || "" } }],
            },
        });
        return res.status(200).json({
            message: "User found",
            data: allUser,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error });
    }
};

// mengupdate data user
const updateUser = async (req: Request, res: Response):Promise<any> => {
    try {
        const id = req.params.id;
        
        const findUser = await prisma.user.findFirst({
            where: { id: Number(id) },
        });

        // jika user tidak ditemukan
        if (!findUser) {
            return res.status(200).json({
                message: "User not found",
            });
        }

        const {
            user_name,
            user_email,
            user_password,
            user_role,
        } = req.body;

        const saveCake = await prisma.user.update({
            where: {id: Number(id)},
            data:{
                user_name: user_name ?? findUser.user_name,
                user_email: user_email ?? findUser.user_email,
                user_password: user_password ?? findUser.user_password,
                user_role: user_role ?? findUser.user_role,
            }
        })

        return res.status(200).json({
            message: "User updated successfully",
            data: saveCake,
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

// menghapus data user
const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;
        const findUser = await prisma.user.findFirst({
            where: { id: Number(id) },
        });

        // jika user tidak ditemukan
        if (!findUser) {
            return res.status(200).json({
                message: "User not found",
            });
        }

        const deleteUser = await prisma.user.delete({
            where: { id: Number(id) },
        })

        return res.status(200).json({
            message: "User deleted successfully",
            data: deleteUser,
        });
    } catch (error) {
        return res.status(500).json(error );
    }
};

export { createUser, readUser, updateUser, deleteUser };
