import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async login(username: string, password: string) {
        const user = await this.userService.login(username, password)
        if (!user) return { statusCode: 401, message: 'Invalid username or password' }
        const payload = { sub: user.id, username: user.username }
        const accessToken = await this.jwtService.signAsync(payload);
        return { access_token: accessToken }
    }

    async getUserInfo(userId: number) {
        const user = await this.userService.findUserById(userId)
        return user
    }
}
