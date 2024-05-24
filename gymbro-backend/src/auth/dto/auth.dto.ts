import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Электронная почта',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StR0nG_Pa$sWoRD', description: 'Пароль' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
