import { Body, Controller, Get, InternalServerErrorException, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { GithubService } from './github.service'
import { Request, Response } from 'express'
import { AuthGithubGuard } from 'src/guards/authGithub.guard'

@Controller('github')
@UseGuards(AuthGithubGuard)
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('/repos')
  async getRepos(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['grp_act'] as string
    const response = await this.githubService.getUserRepos(token)
    return res.status(200).json({ message: 'success', data: response })
  }

  @Post('/commit')
  async commitCodeToRepo(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    const { repo, code } = body
    const token = req.cookies['grp_act']
    const response = await this.githubService.getRepoFilesTree(token, repo)
    // const response = await this.githubService.commit(repo, code, token)
    // if (!response) throw new InternalServerErrorException()
    // return res.status(201).json({ message: 'success', data: response })
  }

  // @Get('/repos/:repoName/files')
  // async getRepoFilesTree(@Req() req: Request, @Param() params: { repoName: string }, @Body() body: any, @Res() res: Response) {
  //   const token = req.cookies['grp_act']
  //   const { username } = body
  //   const response = await this.githubService.getRepoFilesTree(token, username, params.repoName)
  //   return res.status(200).json({ message: 'success', data: response })
  // }
}
