import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserBookmarks(userId: number) {
    const bookmarks = (
      await this.prisma.bookmark.findMany({
        where: { userId },
        include: {
          layout: {
            select: {
              id: true,
              name: true,
              metadata: true,
              author: true,
              authorId: true,
              tags: true,
              createdAt: true,
              updatedAt: true,
              status: true,
              layout_views: {
                select: {
                  id: true,
                },
              },
              bookmarks: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })
    ).map((bookmark) => {
      const item = {
        ...bookmark,
        layout: {
          ...bookmark.layout,
          bookmark_count: bookmark.layout.bookmarks.length,
          view_count: bookmark.layout.layout_views.length,
        },
      }
      delete item.layout.bookmarks
      delete item.layout.layout_views
      return item
    })
    return bookmarks
  }

  async saveLayoutToBookmark(userId: number, layoutId: number) {
    try {
      const response = await this.prisma.bookmark.create({
        data: {
          createdAt: new Date(),
          layoutId,
          userId,
        },
      })
      return response
    } catch (err) {
      return null
    }
  }

  async removeFromBookmark(userId: number, layoutId: number) {
    try {
      const bookmarkToDelete = await this.prisma.bookmark.findFirst({ where: { userId: userId, layoutId } })
      if (!bookmarkToDelete) return -1
      if (bookmarkToDelete.userId !== userId) return -2
      const response = await this.prisma.bookmark.deleteMany({
        where: {
          userId,
          layoutId,
        },
      })
      return response
    } catch (err) {
      return -3
    }
  }
}
