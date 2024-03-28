import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt'
import { RegisterDTO } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async register(registerDTO: RegisterDTO) {
        const { username, password, email, avatar } = registerDTO
        const existedUsername = await this.prisma.user.findUnique({ where: { username } })
        if (existedUsername) return -1
        const hashedPassword = hashSync(password, 10)
        const user = await this.prisma.user.create({
            data: {
                createdAt: new Date(),
                username,
                email,
                password: hashedPassword,
                avatar
            }
        })
        return user
    }

    async login(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username
            }
        })
        if (!user) return null
        const hashedPassword = user.password
        const isMatching = compareSync(password, hashedPassword)
        if (!isMatching) return null
        return user
    }

    async findUserById(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!user) return null
        delete user.password
        return user
    }

    async findUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } })
        return user
    }

    async findUserByUsername(username: string) {
        const user = await this.prisma.user.findUnique({ where: { username } })
        return user
    }

    async getUserLayouts(userId: number) {
        const layouts = await this.prisma.layout.findMany({
            where: { authorId: userId },
            include: { author: { select: { username: true, id: true, name: true } } },
        });
        return layouts
    }
}
