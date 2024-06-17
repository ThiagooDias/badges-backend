import { Body, Controller, Get, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { BadgeDto } from 'src/badge/dto/badges.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({
    status: 200,
    description: 'Retorna o perfil do usuário autenticado.',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOne(@Req() req): Promise<UserDto> {
    const authorizationHeader = req.headers.authorization;
    return this.userService.getAuthenticatedUser(authorizationHeader);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiResponse({
    status: 200,
    description: 'Atualiza as informações do perfil do usuário.',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async updateProfile(@Req() req, @Body() updateUserDto: UserDto): Promise<UserDto> {
    const authorizationHeader = req.headers.authorization;
    return this.userService.updateUserProfile(authorizationHeader, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('badges')
  @ApiResponse({
    status: 200,
    description: 'Retorna os emblemas do usuário autenticado.',
    type: [BadgeDto],
  })
  @ApiResponse({ status: 404, description: 'Emblemas não encontrados.' })
  @ApiQuery({ name: 'name', required: false, description: 'Filtrar emblemas pelo nome.' })
  async findUserBadges(@Req() req, @Query('name') name?: string): Promise<BadgeDto[]> {
    const authorizationHeader = req.headers.authorization;
    return this.userService.findUserBadges(authorizationHeader, name);
  }
}
