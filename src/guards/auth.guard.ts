import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { jwtConstants } from 'src/auth/constants'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  getTokenFromCookies(req: Request) {
    return req.cookies['access_token'] ?? null
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const response: Response = context.switchToHttp().getResponse()
    const token = this.getTokenFromCookies(request)
    if (!token) {
      const sessionId = request.cookies['guest_id'] ?? null
      if (!sessionId) {
        response.cookie('guest_id', uuidv4(), { sameSite: 'none', secure: true, httpOnly: true })
      }
      throw new UnauthorizedException()
    }
    try {
      const decoded = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret })
      request.user = decoded
    } catch (err) {
      response.clearCookie('access_token', { sameSite: 'none', secure: true })
      throw new UnauthorizedException()
    }
    return true
  }
}
