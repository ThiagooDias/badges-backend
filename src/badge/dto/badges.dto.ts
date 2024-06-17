import { ApiProperty } from '@nestjs/swagger';

export class BadgeDto {
  @ApiProperty({ example: 1, description: 'O identificador único do emblema' })
  id: number;

  @ApiProperty({ example: 'new-badge', description: 'O identificador único (slug) do emblema' })
  slug: string;

  @ApiProperty({ example: 'Novo Emblema', description: 'O nome do emblema' })
  name: string;

  @ApiProperty({ example: 'https://example.com/badge.png', description: 'O URL da imagem do emblema' })
  img: string;

  @ApiProperty({ example: 'bronze', description: 'A categoria do emblema (bronze, prata ou ouro)', enum: ['bronze', 'silver', 'gold'] })
  category: 'bronze' | 'silver' | 'gold';
}
