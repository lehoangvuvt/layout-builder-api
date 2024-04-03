import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { jwtConstants } from "src/auth/constants";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    getTokenFromCookies(req: Request) {
        return req.cookies['access_token'] ?? null
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const response: Response = context.switchToHttp().getResponse()
        const token = this.getTokenFromCookies(request)
        if (!token) throw new UnauthorizedException()
        try {
            const decoded = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret })
            request.user = decoded;
        } catch (err) {
            response.clearCookie('access_token', { sameSite: 'none', secure: true })
            throw new UnauthorizedException
        }
        return true;
    }

}