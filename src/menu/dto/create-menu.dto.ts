import { IsString, IsOptional, IsInt, IsUUID } from 'class-validator';

export class CreateMenuDto {
  @IsUUID()
  @IsOptional() // Optional since Prisma auto-generates UUIDs
  id?: string;

  @IsString()
  name!: string; // Use `!` to indicate that the property will be initialized before use

  @IsInt()
  @IsOptional() // Mark depth as optional if it's calculated in the service
  depth?: number;

  @IsUUID()
  @IsOptional()
  parent_id?: string;

  @IsString()
  @IsOptional() // Optional since it can be derived from the parent menu
  parentName?: string;
}