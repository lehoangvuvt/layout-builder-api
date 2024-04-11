import { IsArray, IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator'

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

  @IsString()
  @IsNotEmpty()
  status: string

  @IsOptional()
  @IsNumber()
  fork_layout_id?: number
}
