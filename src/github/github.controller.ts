import { Body, Controller, Get, InternalServerErrorException, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { GithubService } from './github.service';
import { Request, Response } from 'express';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) { }

  @Get("/repos")
  async getRepos(@Req() req: Request, @Res() res: Response) {
    if (req.cookies && req.cookies['grp_act']) {
      const token = req.cookies['grp_act'] as string;
      const response = await this.githubService.getUserRepos(token)
      return res.status(200).json({ message: 'success', data: response })
    }
    throw new UnauthorizedException()
  }

  @Post('/commit')
  async commitCodeToRepo(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    if (req.cookies && req.cookies['grp_act']) {
      const { repo, code } = body
      const token = req.cookies['grp_act']
      const response = await this.githubService.commit(repo, code, token)
      if (!response) throw new InternalServerErrorException()
      return res.status(201).json({ message: 'success', data: response })
    }
    throw new UnauthorizedException()
  }

}
