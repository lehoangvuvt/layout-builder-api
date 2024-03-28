import { Body, Controller, Get, NotFoundException, Param, Post, Put, Req, Res, UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateLayoutDTO } from './dto/createLayout.dto';
import { Response } from 'express';
import { VerifyMetadataPipe } from 'src/pipes/verifyMetadata.pipe';
import { UpdateLayoutDTO } from './dto/updateLayout';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Controller('layout')
export class LayoutController {
  constructor(private readonly layoutService: LayoutService, private jwtService: JwtService) { }

  @UseGuards(AuthGuard)
  @Post("/create")
  async createLayout(@Req() req: any, @Body() createLayoutDTO: CreateLayoutDTO, @Res() res: Response) {
    const response = this.layoutService.createLayout(req.user.sub, createLayoutDTO)
    return res.status(201).json(response)
  }

  @UseGuards(AuthGuard)
  @Put("/update/:id")
  async updateLayout(@Param() params: { id: string }, @Req() req: any, @Body() updateLayoutDTO: UpdateLayoutDTO, @Res() res: Response) {
    const userId = req.user.sub
    const layoutId = params.id
    const response = await this.layoutService.updateLayout(parseInt(layoutId), userId, updateLayoutDTO)
    if (response === -1) return { message: 'Invalid layout id' }
    if (response === -2) return { message: 'Invalid owner' }
    if (response === -3) return { message: 'Layout already published' }
    if (response === -4) return { message: 'Unexpected error' }
    console.log({ response })
    return res.status(200).json({ message: 'success', data: response })
  }

  @Get("/layouts/:searchParams")
  async searchLayouts(@Param() params: { searchParams: string }, @Res() res: Response) {
    const { searchParams } = params
    const data = await this.layoutService.findLayouts(searchParams)
    return res.status(200).json({ message: 'success', data })
  }

  @Get("/:id")
  async getLayoutDetails(@Req() req: Request, @Param() param: { id: string }, @Res() res: Response) {
    let userId = -1
    if (req['cookies']['access_token']) {
      const decoded = await this.jwtService.verifyAsync(req['cookies']['access_token'], { secret: jwtConstants.secret })
      userId = decoded.sub
    }
    const response = await this.layoutService.getLayoutDetails(parseInt(param.id), userId)
    if (response === -1) throw new UnauthorizedException()
    if (response === null) throw new NotFoundException()
    return res.status(200).json({ message: 'success', data: response })
  }
}
