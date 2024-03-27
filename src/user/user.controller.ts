import { Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/interceptors/formatResponse.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("/register")
  async register(@Body() regiterDTO: RegisterDTO, @Res() res: Response) {
    const response = await this.userService.register(regiterDTO)
    if (response === -1) return res.status(400).json({ message: "Duplicated username" })
    if (response === -2) return res.status(400).json({ message: "Duplicated email" })
    return res.status(200).json({ message: 'success' })
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FormatResponseInterceptor)
  @Get("/layouts")
  async getMyLayouts(@Req() req: any, @Res() res: Response) {
    const userId = req.user.sub
    const layouts = await this.userService.getUserLayouts(userId);
    return res.status(200).json({
      message: 'success',
      data: layouts,
    })
  }
}
