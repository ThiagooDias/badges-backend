import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ConflictException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { BadgeService } from './badge.service';
import { Badge } from './badge.entity';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { BadgeDto } from './dto/badges.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('badges')
@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os emblemas.',
    type: [BadgeDto],
  })
  findAll(): Promise<Badge[]> {
    return this.badgeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  @ApiResponse({
    status: 200,
    description: 'Retorna os detalhes de um emblema específico.',
    type: BadgeDto,
  })
  @ApiResponse({ status: 404, description: 'Emblema não encontrado.' })
  async findOne(@Param('slug') slug: string): Promise<BadgeDto> {
    return await this.badgeService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'O emblema foi criado com sucesso.',
    type: CreateBadgeDto,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  create(@Body() createBadgeDto: CreateBadgeDto): Promise<Badge> {
    return this.badgeService.create(createBadgeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/redeem/')
  @ApiResponse({
    status: 200,
    description: 'O emblema foi resgatado com sucesso.',
    type: BadgeDto,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  @ApiResponse({
    status: 409,
    description: 'O emblema já foi resgatado por este usuário.',
  })
  async redeem(@Body('slug') slug: string, @Req() req): Promise<BadgeDto> {
    const authorizationHeader = req.headers.authorization;

    return await this.badgeService.redeemBadge(authorizationHeader, slug);
  }
}
