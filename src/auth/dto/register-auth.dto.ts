import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';
import { Role } from 'src/config/enums/roles_enums';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
  //   // Use the countryCode property to validate the phone number
  //   @IsPhoneNumber(null, {
  //     message: 'Phone number is not valid for the given country code',
  //   })

  @ApiProperty()
  @IsNotEmpty()
  // This decorator ensures the role value is one of the values in the Role enum.
  @IsEnum(Role)
  role: Role;
}
