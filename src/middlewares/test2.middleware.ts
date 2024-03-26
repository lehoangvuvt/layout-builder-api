import { CanActivate, ExecutionContext, Injectable, NestMiddleware } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class Test2Middleware implements NestMiddleware {
    use(req: Request, res: any, next: (error?: any) => void) {
        req.body = { ...req.body }
        next()
    }


}