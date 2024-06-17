import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'O endereço de email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'A senha para a conta do usuário' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'O nome do usuário' })
  @IsString()
  name: string;
}
