import { CallHandler, ExecutionContext, NestInterceptor, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'
import { Observable, map } from 'rxjs'

export class TestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map((data) => data))
  }
}
