import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть не меньше 6 символов' })
  password: string;

  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;
}
