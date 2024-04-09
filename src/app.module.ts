import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LayoutModule } from './layout/layout.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './guards/throttler.guard';
import { GithubModule } from './github/github.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      limit: 10,
      ttl: 60
    }]),
    AuthModule, UserModule, PrismaModule, LayoutModule, GithubModule, BookmarkModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: CustomThrottlerGuard
  }],
  exports: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { }
}
