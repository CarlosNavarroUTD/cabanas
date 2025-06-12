//src/controllers/auth.controllers.ts

import { Request, Response } from "express"
import {generateAccessToken} from '../utils/generateToken'
import {cache} from '../utils/cache'
import dayjs from "dayjs"
import { User } from "../models/User"
import bcrypt from "bcrypt";

export const login = (req: Request, res: Response) => {
    //
    
    let name:string = "Carlos";

    const {username, password} = req.body;

    if (username !== 'Admin' || password !== '123456789') {
        return res.status(401).json({message: "Credenciales incorrectas"
        })
    }

    const userId = 'abc123';

    const accesToken = generateAccessToken(userId);

    cache.set(userId, accesToken, 60 * 15);

    return res.json({
        message: 'login',
        accesToken
    })
}

export const getTime =(req:Request, res:Response) => {
    const {userId} = req.params;
    const ttl = cache.getTtl(userId);
    
    if(!ttl){
        return res.status(404).json({message: "Token no encontrado"})
    }

    const now=Date.now();
    const timeToLifeSeconds=Math.floor((ttl-now)/1000);
    const expTime = dayjs(ttl).format('HH:mm:ss');

    return res.json({
        timeToLifeSeconds,
        expTime
    })
}

export const updateTime = (req: Request, res: Response) => {
    const { userId } = req.body;
  
    const ttl = cache.getTtl(userId);
    
    if (!ttl) {
      return res.status(404).json({ message: 'Token no encontrado o expirado' });
    }
  
    const nuevaTTLsegundos : number = 60 * 10;
    cache.ttl(userId, nuevaTTLsegundos);
  
    res.json("Actualizado con éxito");
  };

export const getAllUsers = async (req:Request, res:Response) => {
    const userList = await User.find();
    ///const userList = await User.find({status:true});

    return  res.json({ userList }); 
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, email, role } = req.body;

        // 🔹 Generar el hash de la contraseña antes de almacenarla
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            password: hashedPassword,  // 🔹 Se almacena la contraseña encriptada
            email,
            role,
            status: true
        });

        const user = await newUser.save();
        return res.json({ user });

    } catch (error) {
        console.log("Error ocurrido en createUser:", error);
        return res.status(500).json({ error: "Error al crear el usuario" });
    }
};