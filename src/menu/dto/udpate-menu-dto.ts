import { IsOptional, IsString, IsInt, IsUUID } from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID() 
  parentId?: string; 

  @IsInt()
  depth: number;
}
