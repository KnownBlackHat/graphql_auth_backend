import { prismaClient } from "../lib/db"
import JWT from "jsonwebtoken";
import { createHmac, randomBytes} from 'node:crypto';

declare var process : {
  env: {
    JWT_SECRET: string
  }
}

const JWT_SECRET = process.env.JWT_SECRET

export interface CreateUserPayload {
    firstName: string
    lastName?: string
    email: string
    password: string
}

export interface GetUserTokenPayload {
    email: string
    password: string
}

class UserService {

    private static generateHash(salt: string, password: string) {
        const hashedPassword = createHmac('sha-256', salt).update(password)
            .digest("hex");

        return hashedPassword;
    }

    public static getUserById(id: string) {
        return prismaClient.user.findUnique({ where: { id } });
    }

    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = UserService.generateHash(salt, password);
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                salt,
                password: hashedPassword
            }
        })

    }

    private static getUser(email: string) {
        return prismaClient.user.findUnique({ where: { email } })
    }

    public static async generateToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;
        const user = await UserService.getUser(email);

        if (!user) throw new Error("User Not Found");

        const userHashPassword = UserService.generateHash(user.salt, password)
        
        if (userHashPassword !== user.password)
            throw new Error("Incorrect Password!!")

        const token = JWT.sign({
            id: user.id,
            email: user.email,
        }, JWT_SECRET)

        return token;
    }

    public static decodeJWTToken(token: string) {
        return JWT.verify(token, JWT_SECRET)
    }
}
export default UserService
