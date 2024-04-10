import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateLayoutDTO } from './dto/createLayout.dto'
import { Prisma } from '@prisma/client'
import { UpdateLayoutDTO } from './dto/updateLayout'

@Injectable()
export class LayoutService {
  constructor(private prisma: PrismaService) {}

  async createLayout(userId: number, createLayoutDTO: CreateLayoutDTO) {
    const { metadata, name, tags, status } = createLayoutDTO
    return this.prisma.layout.create({
      data: {
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata,
        authorId: userId,
        tags,
        name,
        status,
      },
    })
  }

  async updateLayout(id: number, userId: number, updateLayoutDTO: UpdateLayoutDTO) {
    const { metadata, name, tags, status } = updateLayoutDTO
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
          name,
          tags,
          metadata,
          status,
          updatedAt: new Date(),
        },
      })
      return updateLayout
    } catch (error) {
      return -4
    }
  }

  async findLayouts(searchParams: string, userId: number | null = null) {
    let query: { [key: string]: string[] } = {}
    searchParams.split('&').forEach((item) => {
      query[item.split('=')[0]] = item.split('=')[1].split(',')
    })
    const page = query['page'] ? parseInt(query['page'][0]) : 0
    const q = query['q'] ? query['q'][0] : ''
    const take = query['take'] ? parseInt(query['take'][0]) : 12
    const status = query['status'] ? query['status'] : ['published']
    const whereInput: Prisma.LayoutWhereInput = {
      OR: [
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          tags: {
            has: q,
          },
        },
        {
          author: {
            username: {
              contains: q,
              mode: 'insensitive',
            },
          },
        },
      ],
      AND: userId
        ? {
            status: { in: status },
            authorId: userId,
          }
        : {
            status: { in: status },
          },
    }
    const sortByQuery = query['sortBy'] ? query['sortBy'][0] : 'latest'
    let orderBy = null
    switch (sortByQuery) {
      case 'pop':
        orderBy = [
          {
            layout_views: { _count: 'desc' },
          },
          {
            bookmarks: { _count: 'desc' },
          },
        ]
        break
      case 'latest':
      default:
        orderBy = { updatedAt: 'desc' }
        break
    }

    const count = await this.prisma.layout.count({
      where: whereInput,
      orderBy,
    })
    const layouts = (
      await this.prisma.layout.findMany({
        where: whereInput,
        orderBy,
        include: {
          author: { select: { username: true, id: true, name: true, avatar: true } },
          layout_views: { select: { id: true } },
          bookmarks: { select: { id: true } },
        },
        skip: page * take,
        take,
      })
    ).map((layout) => {
      const item = { ...layout, view_count: layout.layout_views.length, bookmark_count: layout.bookmarks.length }
      delete item.bookmarks
      delete item.layout_views
      return item
    })
    return {
      items: layouts,
      current_page: page,
      total_page: Math.ceil(count / take),
      total: count,
      limit: take,
    }
  }

  async getLayoutDetails(id: number, userId: number | null, guestId: string | null) {
    const layout = await this.prisma.layout.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            id: true,
            name: true,
          },
        },
      },
    })
    const isOwner = layout.authorId === userId
    if (layout.status === 'draft') {
      if (!isOwner) return -1
    } else {
      if (!isOwner) {
        const viewer_id = userId ? userId.toString() : guestId
        this.prisma.layoutView
          .create({
            data: {
              viewer_id,
              layoutId: layout.id,
            },
          })
          .then()
          .catch((ex) => {})
        // this.updateLayoutDynamicFields(layout.id, { view_count: currentViewCount + 1 })
      }
    }
    return layout
  }

  async updateLayoutDynamicFields(id: number, updateFields: Prisma.LayoutUpdateInput) {
    const response = await this.prisma.layout.update({
      where: { id },
      data: {
        ...updateFields,
      },
    })
    return response
  }

  async getTopLayouts() {
    const layouts = await this.prisma.layout.findMany({ take: 5 })
    return layouts
  }

  async removeLayout(userId: number, layoutId: number): Promise<number> {
    const layout = await this.prisma.layout.findUnique({ where: { id: layoutId } })
    if (!layout) return -1
    if (layout.status === 'published') return -2
    if (layout.authorId !== userId) return -3
    try {
      const response = await this.prisma.layout.delete({ where: { id: layoutId } })
      return 1
    } catch (err) {
      return -4
    }
  }
}
