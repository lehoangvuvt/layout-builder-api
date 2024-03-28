import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtConstants } from "src/auth/constants";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    getTokenFromHeaders(request: Request) {
        return request.cookies['access_token'] ?? null
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.getTokenFromHeaders(request)
        try {
            const decoded = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret })
            request.user = decoded
        } catch (err) { }
        return true
    }

}