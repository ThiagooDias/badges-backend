import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Badge } from 'src/badge/badge.entity';
import { UserDto } from './dto/user.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findUserBadges(
    authorizationHeader: string,
    name?: string,
  ): Promise<Badge[]> {
    const userId = (await this.getAuthenticatedUser(authorizationHeader)).id;
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.badges', 'badges')
      .where('user.id = :userId', { userId });

    if (name) {
      query.andWhere('badges.name ILIKE :name', { name: `%${name}%` });
    }

    const userWithBadges = await query.getOne();

    if (!userWithBadges) {
      throw new NotFoundException('Emblemas não encontrados.');
    }

    return userWithBadges.badges;
  }

  async updateUserProfile(
    authorizationHeader: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    let user = await this.getAuthenticatedUser(authorizationHeader);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    user = { ...user, ...updateUserDto };

    await this.userRepository.save(user);

    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  async getAuthenticatedUser(authorizationHeader: string): Promise<UserDto> {
    const token = this.extractToken(authorizationHeader);

    const payload = this.jwtService.verify(token);
    const userId = payload.sub;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  private extractToken(authorizationHeader: string): string {
    if (!authorizationHeader) {
      throw new UnauthorizedException(
        'Cabeçalho de autorização não encontrado.',
      );
    }
    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Formato de cabeçalho de autorização inválido.',
      );
    }
    return token;
  }
}
