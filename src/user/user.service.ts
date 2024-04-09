import { Injectable } from '@nestjs/common'
import { compareSync, hashSync } from 'bcrypt'
import { RegisterDTO } from './dto/register.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
        avatar,
      },
    })
    return user
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    })
    if (!user) return null
    const hashedPassword = user.password
    const isMatching = compareSync(password, hashedPassword)
    if (!isMatching) return null
    return user
  }

  async findUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })
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

  async getUserLayouts(userId: number, searchParams: string) {
    let query = {}
    searchParams.split('&').forEach((param) => {
      const key = param.split('=')[0]
      const values = param.split('=')[1].split(',')
      query[key] = values
    })
    const page = query['page'] ? parseInt(query['page'][0]) : 0
    const status = query['status'] ? query['status'] : ['draft', 'published']
    const take = query['take'] ? parseInt(query['take'][0]) : 12
    const orderBy = query['sortBy'] ? query['sortBy'][0] : 'updatedAt'
    const direction = query['direction'] ? query['direction'][0] : 'desc'
    const skip = take * page
    const whereInput: Prisma.LayoutWhereInput = {
      authorId: userId,
      status: { in: status },
    }
    const count = await this.prisma.layout.count({
      where: whereInput,
      orderBy: { [orderBy]: direction },
    })
    const layouts = await this.prisma.layout.findMany({
      where: whereInput,
      orderBy: { [orderBy]: direction },
      take,
      skip,
      include: { author: { select: { username: true, id: true, name: true, avatar: true } } },
    })
    return {
      items: layouts,
      current_page: page,
      total_page: Math.ceil(count / take),
      total: count,
      limit: take,
    }
  }
}
