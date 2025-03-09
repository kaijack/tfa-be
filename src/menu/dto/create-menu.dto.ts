import { IsString, IsOptional, IsInt, IsUUID } from 'class-validator';

export class CreateMenuDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @IsInt()
  @IsOptional()
  depth?: number;

  @IsUUID()
  @IsOptional()
  parent_id?: string;

  @IsString()
  @IsOptional()
  parentName?: string;
}