import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLayoutDTO } from './dto/createLayout.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LayoutService {
    constructor(private prisma: PrismaService) { }

    async createLayout(userId: number, createLayoutDTO: CreateLayoutDTO) {
        const { metadata, name, tags } = createLayoutDTO
        return this.prisma.layout.create({
            data: {
                createdAt: new Date(),
                metadata,
                authorId: userId,
                tags,
                name
            }
        })
    }

    async findLayouts(searchParams: string) {
        let query: { [key: string]: string[] } = {}
        searchParams.split('&').forEach((item) => {
            query[item.split('=')[0]] = item.split('=')[1].split(',')
        })
        const page = query['page'] ? parseInt(query['page'][0]) : 0
        const q = query['q'] ? query['q'][0] : ''
        const whereInput: Prisma.LayoutWhereInput = {
            OR: [
                {
                    name: {
                        contains: q,
                        mode: 'insensitive'
                    }
                },
                {
                    tags: {
                        has: q
                    }
                },
                {
                    author: {
                        username: {
                            contains: q,
                            mode: 'insensitive'
                        }
                    }
                }
            ]
        }
        const take = 10
        const count = await this.prisma.layout.count({
            where: whereInput
        })
        const layouts = await this.prisma.layout.findMany({
            where: whereInput,
            include: { author: { select: { username: true, id: true, name: true } } },
            skip: page * take, take
        })
        return {
            items: layouts,
            current_page: page,
            total_page: Math.ceil(count / take),
            total: count,
            limt: take
        }
    }

    async getLayoutDetails(id: number) {
        const layout = await this.prisma.layout.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        username: true,
                        id: true,
                        name: true
                    }
                }
            }
        });
        return layout
    }
}   