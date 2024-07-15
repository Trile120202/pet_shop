import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  // @IsOptional()
  // roleId?: number;
}
