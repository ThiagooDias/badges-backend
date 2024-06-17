import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBadgeDto {
  @ApiProperty({ example: 'new-badge', description: 'O identificador único (slug) para o novo emblema' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Novo Emblema', description: 'O nome do novo emblema' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'bronze', description: 'A categoria do novo emblema (bronze, prata ou ouro)', enum: ['bronze', 'silver', 'gold'] })
  @IsString()
  category: 'bronze' | 'silver' | 'gold';
}
