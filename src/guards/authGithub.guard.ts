import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from 'src/auth/auth.service'

@Injectable()
export class AuthGithubGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  getGithubToken(request: Request) {
    const token = request.cookies['grp_act'] ?? null
    return token
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const token = this.getGithubToken(request)
    if (!token) throw new UnauthorizedException()
    return true
  }
}
