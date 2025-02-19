import { IsOptional, IsString, IsInt, IsUUID } from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID() // If using UUIDs
  parentId?: string; // Use string for parentId

  @IsInt()
  depth: number;
}
