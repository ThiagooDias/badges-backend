import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty({ example: 1, description: 'O identificador único do usuário' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'john.doe@example.com', description: 'O endereço de email do usuário' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'O nome do usuário' })
  @Expose()
  name: string;
}
