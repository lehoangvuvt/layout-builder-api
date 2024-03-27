import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async getGoogleToken(query: any) {
        const { code } = query
        try {
            const body = {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
                grant_type: 'authorization_code'
            }
            const { data } = await axios.post(
                'https://oauth2.googleapis.com/token',
                body,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )
            const { access_token, id_token } = data;
            return {
                access_token, id_token
            }
        } catch (err) {
            return null
        }
    }

    async getGithubToken(code: string) {
        const clientId = process.env.GITHUB_CLIENT_ID
        const clientSecret = process.env.GITHUB_CLIENT_SECRET
        const response = await axios({
            method: "POST",
            url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
            headers: {
                Accept: "application/json",
            },
        })
        const data = response.data
        const access_token = data.access_token
        return access_token
    }

    async getGithubUserInfo(token: string) {
        const getUserData = axios({
            method: "GET",
            url: ` https://api.github.com/user`,
            headers: {
                Authorization: `token ${token}`,
            },
        })

        const getUserEmails = axios({
            method: "GET",
            url: ` https://api.github.com/user/emails`,
            headers: {
                Authorization: `token ${token}`,
            },
        })

        const [userDataRes, userEmailsRes] = await Promise.all([getUserData, getUserEmails])

        const { email } = userEmailsRes.data.filter((item: any) => item.primary === true)[0]

        const data = userDataRes.data
        data.email = email
        console.log(data)
        return data
    }

    async getGoogleUser(id_token: string, access_token: string) {
        const { data } = await axios.get(
            'https://www.googleapis.com/oauth2/v1/userinfo',
            {
                params: {
                    access_token,
                    alt: 'json'
                },
                headers: {
                    Authorization: `Bearer ${id_token}`
                }
            }
        )
        return data
    }

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
