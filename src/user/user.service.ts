import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt'
import { RegisterDTO } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async register(registerDTO: RegisterDTO) {
        const { username, password } = registerDTO
        const existed = await this.prisma.user.findUnique({ where: { username } })
        if (existed) return 'username existed'
        const hashedPassword = hashSync(password, 10)
        return this.prisma.user.create({
            data: {
                createdAt: new Date(),
                username,
                password: hashedPassword,
            }
        })

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

    async getUserLayouts(userId: number) {
        const layouts = await this.prisma.layout.findMany({
            where: { authorId: userId },
            include: { author: { select: { username: true, id: true, name: true } } },
        });
        return layouts
    }
}
