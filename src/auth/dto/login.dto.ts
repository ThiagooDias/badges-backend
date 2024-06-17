import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'O endereço de email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'A senha para a conta do usuário',
  })
  @IsString()
  password: string;
}
