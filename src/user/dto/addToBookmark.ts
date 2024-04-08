import { IsNotEmpty, IsNumber } from "class-validator";

export class AddToBookmarkDTO {
    @IsNotEmpty()
    @IsNumber()
    layoutId: number
}