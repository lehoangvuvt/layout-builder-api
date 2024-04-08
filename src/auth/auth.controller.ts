import { Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { AuthGuard } from 'src/guards/auth.guard'
import { UserService } from 'src/user/user.service'
import { JwtService } from '@nestjs/jwt'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService, private jwtSerivce: JwtService) {}

  @Post('/login')
  async login(@Body() loginDTO: Record<string, string>, @Res() res: Response) {
    const response = await this.authService.login(loginDTO.username, loginDTO.password)
    if (response.access_token) {
      res.cookie('access_token', response.access_token, { httpOnly: true, sameSite: 'none', secure: true })
      return res.status(200).json({ message: 'Success' })
    }
    return res.status(401).json({ message: 'Invalid  username or password' })
  }

  @UseGuards(AuthGuard)
  @Get('/sign-out')
  async signOut(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('access_token', { secure: true, sameSite: 'none' })
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

  @Get('/oauth/github/repo/:layoutId')
  async grantAccessRepoGithub(@Param() params: { layoutId: string }, @Req() req: Request, @Res() res: Response) {
    const { code } = req.query
    const accessToken = await this.authService.getGithubToken(code.toString())
    res.cookie('grp_act', accessToken, { sameSite: 'none', secure: true, httpOnly: true })
    res.redirect(`${process.env.CLIENT_URL}/layout-builder/setup/${params.layoutId}/?mode=granted`)
  }

  @Get('/oauth/:type')
  async oauthGoogle(@Param() params: { type: 'google' | 'github' | 'facebook' }, @Req() req: Request, @Res() res: Response) {
    let existedUser = null
    switch (params.type) {
      case 'google':
        const data = await this.authService.getGoogleToken(req.query)
        if (!data) throw new UnauthorizedException()
        const { access_token, id_token } = data
        const googleAccountData = await this.authService.getGoogleUser(id_token, access_token)
        const { email: gmail, picture, id: ggId } = googleAccountData
        existedUser = await this.userService.findUserByEmail(gmail)
        if (existedUser) {
          const payload = { sub: existedUser.id, username: existedUser.username }
          const access_token = await this.jwtSerivce.signAsync(payload)
          res.cookie('access_token', access_token, { httpOnly: true, sameSite: 'none', secure: true })
          res.redirect(`${process.env.CLIENT_URL}/search`)
        } else {
          const ggUsername = `gid_${ggId}`
          const data = await this.userService.register({
            email: gmail,
            username: ggUsername,
            avatar: picture,
            password: ggUsername,
          })
          if (data === -1) return
          const payload = { sub: data.id, username: ggUsername }
          const access_token = await this.jwtSerivce.signAsync(payload)
          res.cookie('access_token', access_token, { httpOnly: true, sameSite: 'none', secure: true })
          res.redirect(`${process.env.CLIENT_URL}/search`)
        }
        break
      case 'github':
        const { code } = req.query
        const accessToken = await this.authService.getGithubToken(code.toString())
        const userData = await this.authService.getGithubUserInfo(accessToken)
        const { id: ghId, avatar_url, email: ghEmail } = userData
        const gh_userName = `ghid_${ghId}`
        existedUser = await this.userService.findUserByUsername(gh_userName)
        if (existedUser) {
          const payload = { sub: existedUser.id, username: existedUser.username }
          const access_token = await this.jwtSerivce.signAsync(payload)
          res.cookie('access_token', access_token, { httpOnly: true, sameSite: 'none', secure: true })
          res.redirect(`${process.env.CLIENT_URL}/search`)
        } else {
          const data = await this.userService.register({
            username: gh_userName,
            avatar: avatar_url,
            password: gh_userName,
          })
          if (data === -1) return
          const payload = { sub: data.id, username: gh_userName }
          const access_token = await this.jwtSerivce.signAsync(payload)
          res.cookie('access_token', access_token, { httpOnly: true, sameSite: 'none', secure: true })
          res.redirect(`${process.env.CLIENT_URL}/search`)
        }
        break
      case 'facebook':
        break
    }
  }
}
