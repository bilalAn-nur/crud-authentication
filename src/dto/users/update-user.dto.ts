import { IsEmail, IsNotEmpty, IsStrongPassword, Matches, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Matches('password')
  confirmPassword: string;
}
