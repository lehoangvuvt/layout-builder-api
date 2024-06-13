import { IsNotEmpty, IsString, IsNumber, IsOptional, IsIn } from 'class-validator'

export class CreateCommentDTO {
  @IsNumber()
  @IsNotEmpty()
  layout_id: number

  @IsString()
  @IsNotEmpty()
  content: string

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  reply_to_comment_id: number
}
