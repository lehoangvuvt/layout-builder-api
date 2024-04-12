import { IsArray, IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator'

export class CreateCommentDTO {
  @IsNumber()
  @IsNotEmpty()
  layout_id: number

  @IsString()
  @IsNotEmpty()
  content: string
}
