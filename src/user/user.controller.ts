import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterDTO } from './dto/register.dto'
import { Response } from 'express'
import { AuthGuard } from 'src/guards/auth.guard'
import { AddToBookmarkDTO } from './dto/addToBookmark'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() regiterDTO: RegisterDTO, @Res() res: Response) {
    const response = await this.userService.register(regiterDTO)
    if (response === -1) return res.status(400).json({ message: 'Duplicated username' })
    return res.status(201).json({ message: 'success' })
  }

  @UseGuards(AuthGuard)
  @Get('/layouts/:searchParams')
  async getMyLayouts(@Param() params: { searchParams: string }, @Req() req: any, @Res() res: Response) {
    const userId = req.user.sub
    const layouts = await this.userService.getUserLayouts(userId, params.searchParams)
    return res.status(200).json({
      message: 'success',
      data: layouts,
    })
  }

  @UseGuards(AuthGuard)
  @Get('/bookmarks')
  async getUserBookmarks(@Req() req: any, @Res() res: Response) {
    const userId = req.user.sub
    const bookmarks = await this.userService.getUserBookmarks(userId)
    return res.status(200).json({ message: 'success', data: bookmarks })
  }

  @UseGuards(AuthGuard)
  @Post('/bookmarks/add-to-bookmark')
  async addLayoutToBookmark(@Req() req: any, @Body() addToBookmarkDTO: AddToBookmarkDTO, @Res() res: Response) {
    const userId = req.user.sub
    const response = await this.userService.saveLayoutToBookmark(userId, addToBookmarkDTO.layoutId)
    if (!response) res.status(400).json({ message: 'error' })
    return res.status(201).json({ message: 'success' })
  }

  @UseGuards(AuthGuard)
  @Delete('/bookmarks/remove-from-bookmark')
  async removeLayoutFromBookmark(@Req() req: any, @Body() addToBookmarkDTO: AddToBookmarkDTO, @Res() res: Response) {
    const userId = req.user.sub
    const response = await this.userService.removeFromBookmark(userId, addToBookmarkDTO.layoutId)
    if (!response) res.status(400).json({ message: 'error' })
    return res.status(204).json({ message: 'success' })
  }
}
