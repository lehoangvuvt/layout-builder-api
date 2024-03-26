import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtConstants } from "src/auth/constants";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    getTokenFromCookies(req: Request) {
        return req.cookies['access_token'] ?? null
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.getTokenFromCookies(request)
        if (!token) throw new UnauthorizedException()
        try {
            const decoded = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret })
            request.user = decoded;
        } catch (err) {
            throw new UnauthorizedException
        }
        return true;
    }

}