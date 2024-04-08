import { Module } from '@nestjs/common'
import { GithubService } from './github.service'
import { GithubController } from './github.controller'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  controllers: [GithubController],
  providers: [GithubService],
  imports: [AuthModule],
})
export class GithubModule {}
