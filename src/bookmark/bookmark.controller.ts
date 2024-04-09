import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { BookmarkService } from './bookmark.service'
import { Response } from 'express'
import { AuthGuard } from 'src/guards/auth.guard'
import { AddToBookmarkDTO } from 'src/user/dto/addToBookmark'

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getUserBookmarks(@Req() req: any, @Res() res: Response) {
    const userId = req.user.sub
    const bookmarks = await this.bookmarkService.getUserBookmarks(userId)
    return res.status(200).json({ message: 'success', data: bookmarks })
  }

  @UseGuards(AuthGuard)
  @Post('/add-to-bookmark')
  async addLayoutToBookmark(@Req() req: any, @Body() addToBookmarkDTO: AddToBookmarkDTO, @Res() res: Response) {
    const userId = req.user.sub
    const response = await this.bookmarkService.saveLayoutToBookmark(userId, addToBookmarkDTO.layoutId)
    if (!response) res.status(400).json({ message: 'error' })
    return res.status(201).json({ message: 'success' })
  }

  @UseGuards(AuthGuard)
  @Delete('/remove-from-bookmark')
  async removeLayoutFromBookmark(@Req() req: any, @Body() addToBookmarkDTO: AddToBookmarkDTO, @Res() res: Response) {
    const userId = req.user.sub
    const response = await this.bookmarkService.removeFromBookmark(userId, addToBookmarkDTO.layoutId)
    if (!response) res.status(400).json({ message: 'error' })
    return res.status(204).json({ message: 'success' })
  }
}
