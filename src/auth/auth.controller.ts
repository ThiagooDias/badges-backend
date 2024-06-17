import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso.',
    type: UserDto,
  })
  @ApiResponse({ status: 409, description: 'Este email já está em uso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  async register(@Body() body: CreateUserDto) {
    const user = await this.authService.register(
      body.email,
      body.password,
      body.name,
    );
    return user;
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() body: LoginDto) {
    const token = await this.authService.login(body.email, body.password);
    return token
  }
}
