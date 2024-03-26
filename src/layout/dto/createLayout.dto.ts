import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateLayoutDTO {
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