import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLayoutDTO } from './dto/createLayout.dto';
import { Prisma } from '@prisma/client';
import { UpdateLayoutDTO } from './dto/updateLayout';

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
    async updateLayout(id: number, userId: number, updateLayoutDTO: UpdateLayoutDTO) {
        const { metadata, name, tags } = updateLayoutDTO
        const layout = await this.prisma.layout.findUnique({ where: { id } })
        if (!layout) return -1
        const isValidOwner = layout.authorId === userId
        const isDraftLayout = layout.status === 'draft'
        if (!isValidOwner) return -2
        if (!isDraftLayout) return -3
        try {
            const updateLayout = await this.prisma.layout.update({
                where: { id },
                data: {
                    name, tags, metadata
                }
            })
            return updateLayout
        } catch (error) {
            return -4
        }
    }

    async findLayouts(searchParams: string) {
        let query: { [key: string]: string[] } = {}
        searchParams.split('&').forEach((item) => {
            query[item.split('=')[0]] = item.split('=')[1].split(',')
        })
        const page = query['page'] ? parseInt(query['page'][0]) : 0
        const q = query['q'] ? query['q'][0] : ''
        const take = query['take'] ? parseInt(query['take'][0]) : 10
        const whereInput: Prisma.LayoutWhereInput = {
            OR: [
                {
                    name: {
                        contains: q,
                        mode: 'insensitive'
                    },
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
            ],
            AND: {
                status: 'published'
            }
        }
        const count = await this.prisma.layout.count({
            where: whereInput,
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

    async getLayoutDetails(id: number, userId: number) {

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
        if (layout.status === 'draft') {
            const isOwner = layout.authorId === userId
            if (!isOwner) return -1
        }
        return layout
    }

    async getTopLayouts() {
        const layouts = await this.prisma.layout.findMany({ take: 5 })
        return layouts
    }
}   
