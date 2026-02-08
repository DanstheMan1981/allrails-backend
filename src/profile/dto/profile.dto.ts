import { IsString, IsOptional, Matches, MinLength, MaxLength } from 'class-validator';

export class UpsertProfileDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/, {
    message: 'Username must be lowercase alphanumeric with hyphens only (no leading/trailing hyphens)',
  })
  username: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  displayName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  bio?: string;
}
