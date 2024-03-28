import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateLayoutDTO {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    metadata: string

    @IsArray()
    @IsNotEmpty()
    tags: string[]
}