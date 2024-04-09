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
}
