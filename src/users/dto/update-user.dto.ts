import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @MinLength(6)
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  username?: string;

  @ApiProperty()
  @IsString()
  email?: string;

  @ApiProperty()
  @IsString()
  phoneNumber?: string;

  @ApiProperty()
  @IsString()
  countryCode?: string;

  @ApiProperty()
  @IsString()
  about?: string;
}
