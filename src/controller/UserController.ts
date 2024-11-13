import { Request, Response } from "express";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// membuat data user
const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { 
            user_name, 
            user_email, 
            user_password, 
            user_role 
        } = req.body;

        // validasi role berdasarkan enum
        if (!Object.values(UserRole).includes(user_role)) {
            return res.status(400).json({ message: "Invalid user role" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(user_password, 10);

        const newUser = await prisma.user.create({
            data: {
                user_name,
                user_email,
                user_password: hashedPassword,
                user_role,
            },
        });

        return res.status(201).json({
            message: "User created successfully",
            data: newUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// membaca data user
const readUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        // Cari user berdasarkan id
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        // Jika user tidak ditemukan
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User found",
            data: user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error});
    }
};

// mengupdate data user
const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        // Cari user berdasarkan id
        const findUser = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        // Jika user tidak ditemukan
        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const { user_name, user_email, user_password, user_role } = req.body;

        let hashedPassword;
        if (user_password) {
            hashedPassword = await bcrypt.hash(user_password, 10);
        }

        // Perbarui user
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                user_name: user_name ?? findUser.user_name,
                user_email: user_email ?? findUser.user_email,
                user_password: user_password ? hashedPassword : findUser.user_password,
                user_role: user_role ?? findUser.user_role,
            },
        });

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
};

// menghapus data user
const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        // Cari user berdasarkan id
        const findUser = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        // Jika user tidak ditemukan
        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Hapus user
        const deletedUser = await prisma.user.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({
            message: "User deleted successfully",
            data: deletedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
};

export { createUser, readUser, updateUser, deleteUser };
