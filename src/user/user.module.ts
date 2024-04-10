import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { LayoutModule } from 'src/layout/layout.module'

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [PrismaModule, LayoutModule],
})
export class UserModule {}
