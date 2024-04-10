import { Module } from '@nestjs/common'
import { LayoutService } from './layout.service'
import { LayoutController } from './layout.controller'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  controllers: [LayoutController],
  providers: [LayoutService],
  imports: [PrismaModule],
  exports: [LayoutService],
})
export class LayoutModule {}
