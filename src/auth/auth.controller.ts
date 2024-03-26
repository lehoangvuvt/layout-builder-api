import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  async login(@Body() loginDTO: Record<string, string>, @Res() res: Response) {
    const response = await this.authService.login(loginDTO.username, loginDTO.password)
    if (response.access_token) {
      res.cookie('access_token', response.access_token, { httpOnly: true, sameSite: 'none', secure: true })
      return res.status(200).json({ message: "Success" })
    }
    return res.status(401).json({ message: 'Invalid  username or password' });
  }

  @UseGuards(AuthGuard)
  @Get('/sign-out')
  async signOut(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('access_token')
    return res.status(200).json({ message: 'Sign out success' })
  }

  @UseGuards(AuthGuard)
  @Get('/authenticate')
  async getUserInfo(@Req() req: Request, @Res() res: Response) {
    const userId = req['user']['sub']
    const user = await this.authService.getUserInfo(userId)
    if (!user) return res.status(401).json({ message: 'User not found' })
    return res.status(200).json(user)
  }
}
