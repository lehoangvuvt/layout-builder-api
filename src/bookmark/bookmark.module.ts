import { Module } from '@nestjs/common'
import { BookmarkService } from './bookmark.service'
import { BookmarkController } from './bookmark.controller'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
  imports: [PrismaModule],
})
export class BookmarkModule {}
