import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class RegisterRequest {
  @IsNotEmpty({message: 'Никнейм не может быть пустым'})
  @IsString({ message: 'Никнейм должен быть строкой' })
  @Length(3, 20, { message: 'Никнейм должен быть от 3 до 20 символов' })
  nickName: string;

  @IsNotEmpty({message: 'Пароль не может быть пустым'})
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть не меньше 6 символов' })
  password: string;

  @IsNotEmpty({message: 'Email не может быть пустым'})
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;
}
