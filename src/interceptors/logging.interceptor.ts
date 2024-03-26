import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    logger = new Logger(LoggingInterceptor.name)

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        this.logger.warn('===TRIGGER GLOBAL INTERCEPTOR (PRE)===')
        const now = Date.now();
        return next.handle().pipe(
            tap(() => {
                this.logger.log(`After... ${Date.now() - now}ms`);
                this.logger.warn('===TRIGGER GLOBAL INTERCEPTOR (POST)===');
            })
        )
    }
}