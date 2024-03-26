import { Body, Controller, Get, NotFoundException, Param, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLayoutDTO } from './dto/createLayout.dto';
import { Response } from 'express';
import { VerifyMetadataPipe } from 'src/pipes/verifyMetadata.pipe';

@Controller('layout')
export class LayoutController {
  constructor(private readonly layoutService: LayoutService) { }

  @UseGuards(AuthGuard)
  @UsePipes(VerifyMetadataPipe)
  @Post("/create")
  async createLayout(@Req() req: any, @Body() createLayoutDTO: CreateLayoutDTO, @Res() res: Response) {
    const response = this.layoutService.createLayout(req.user.sub, createLayoutDTO)
    return res.status(200).json(response)
  }

  @Get("/layouts/:searchParams")
  async searchLayouts(@Param() params: { searchParams: string }, @Res() res: Response) {
    const { searchParams } = params
    const data = await this.layoutService.findLayouts(searchParams)
    return res.status(200).json({ message: 'success', data })
  }

  @Get("/:id")
  async getLayoutDetails(@Param() param: { id: string }, @Res() res: Response) {
    const layout = await this.layoutService.getLayoutDetails(parseInt(param.id))
    if (!layout) throw new NotFoundException()
    return res.status(200).json({ message: 'success', data: layout })
  }
}
