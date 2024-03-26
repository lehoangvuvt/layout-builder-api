import { Injectable, Logger, NestMiddleware } from "@nestjs/common";

@Injectable()
export class TestMiddleware implements NestMiddleware {
    logger = new Logger(TestMiddleware.name)
    use(req: any, res: any, next: (error?: any) => void) {
        this.logger.debug('asdas')
        next()
    }

}