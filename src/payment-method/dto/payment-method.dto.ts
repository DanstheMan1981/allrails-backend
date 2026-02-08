import { IsString, IsOptional, IsBoolean, IsInt, Min, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentMethodDto {
  @IsString()
  @MaxLength(30)
  type: string; // venmo, cashapp, zelle, paypal, crypto, etc.

  @IsString()
  @IsOptional()
  @MaxLength(50)
  label?: string;

  @IsString()
  @MaxLength(200)
  handle: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}

export class UpdatePaymentMethodDto {
  @IsString()
  @IsOptional()
  @MaxLength(30)
  type?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  label?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  handle?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

class ReorderItemDto {
  @IsString()
  id: string;

  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class ReorderPaymentMethodsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  order: ReorderItemDto[];
}
