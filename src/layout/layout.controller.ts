import {
  Body,
  Controller,
  Get,
  Delete,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common'
import { LayoutService } from './layout.service'
import { AuthGuard } from 'src/guards/auth.guard'
import { CreateLayoutDTO } from './dto/createLayout.dto'
import { Response, Request } from 'express'
import { UpdateLayoutDTO } from './dto/updateLayout'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from 'src/auth/constants'
import { CreateCommentDTO } from './dto/createComment.dto'

@Controller('layout')
export class LayoutController {
  constructor(private readonly layoutService: LayoutService, private jwtService: JwtService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  async createLayout(@Req() req: any, @Body() createLayoutDTO: CreateLayoutDTO, @Res() res: Response) {
    const response = this.layoutService.createLayout(req.user.sub, createLayoutDTO)
    return res.status(201).json(response)
  }

  @UseGuards(AuthGuard)
  @Put('/update/:id')
  async updateLayout(@Param() params: { id: string }, @Req() req: any, @Body() updateLayoutDTO: UpdateLayoutDTO, @Res() res: Response) {
    const userId = req.user.sub
    const layoutId = params.id
    const response = await this.layoutService.updateLayout(parseInt(layoutId), userId, updateLayoutDTO)
    if (response === -1) return { message: 'Invalid layout id' }
    if (response === -2) return { message: 'Invalid owner' }
    if (response === -3) return { message: 'Layout already published' }
    if (response === -4) return { message: 'Unexpected error' }
    return res.status(200).json({ message: 'success', data: response })
  }

  @Get('/layouts/:searchParams')
  async searchLayouts(@Param() params: { searchParams: string }, @Res() res: Response) {
    const { searchParams } = params
    const data = await this.layoutService.findLayouts(searchParams)
    return res.status(200).json({ message: 'success', data })
  }

  @Get('/:id')
  async getLayoutDetails(@Req() req: Request, @Param() param: { id: string }, @Res() res: Response) {
    let userId: number | null = null
    let guestId: string | null = null
    if (req.cookies['access_token']) {
      try {
        const decoded = await this.jwtService.verifyAsync(req['cookies']['access_token'], { secret: jwtConstants.secret })
        userId = decoded.sub
      } catch (err) {
        guestId = req.cookies['guest_id']
      }
    } else {
      guestId = req.cookies['guest_id']
    }
    const response = await this.layoutService.getLayoutDetails(parseInt(param.id), userId, guestId)
    if (response === -1) throw new UnauthorizedException()
    if (response === null) throw new NotFoundException()
    return res.status(200).json({ message: 'success', data: response })
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteLayout(@Req() req: any, @Param() params: { id: string }, @Res() res: Response) {
    const userId = parseInt(req.user.sub)
    const layoutId = parseInt(params.id)
    const response = await this.layoutService.removeLayout(userId, layoutId)
    switch (response) {
      case -4:
        return res.status(400).json({ message: 'Internal server error' })
      case -3:
        return res.status(400).json({ message: 'Not have permission' })
      case -2:
        return res.status(400).json({ message: 'Already published' })
      case -1:
        return res.status(400).json({ message: 'Invalid layout id' })
      case 1:
        return res.status(200).json({ message: 'success' })
    }
  }

  @UseGuards(AuthGuard)
  @Post('/comments')
  async createComment(@Req() req: any, @Body() createCommentDTO: CreateCommentDTO, @Res() res: Response) {
    const userId = req.user.sub
    const response = await this.layoutService.createComment(userId, createCommentDTO)
    if (!response) throw new BadRequestException()
    return res.status(200).json({ message: 'success', data: response })
  }

  @Get('/comments/:id')
  async getLayoutComments(@Param() params: { id: string }, @Query() query: { page?: string; limit?: string }, @Res() res: Response) {
    const response = await this.layoutService.getLayoutComments(parseInt(params.id), query)

    return res.status(200).json({ message: 'success', data: response })
  }
}
