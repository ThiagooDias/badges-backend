// src/badge/badge.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './badge.entity';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { User } from 'src/user/user.entity';
import { BadgeDto } from './dto/badges.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge) private badgesRepository: Repository<Badge>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService
  ) {}

  findAll(): Promise<Badge[]> {
    return this.badgesRepository.find();
  }

  async findOne(slug: string): Promise<Badge> {
    const badge = await this.badgesRepository.findOne({ where: { slug } });
    
    if (!badge) {
      throw new NotFoundException('Emblema não encontrado.');
    }
    
    return badge;
  }

  async create(createBadgeDto: CreateBadgeDto): Promise<Badge> {
    const badge = this.badgesRepository.create(createBadgeDto);
    return this.badgesRepository.save(badge);
  }

  async redeemBadge(authorizationHeader: string, badgeSlug: string): Promise<BadgeDto> {
    const userId = (await this.userService.getAuthenticatedUser(authorizationHeader)).id
    
    const badge = await this.badgesRepository.findOne({
      where: { slug: badgeSlug },
      relations: ['users'],
    });

    if (!badge) {
      throw new NotFoundException('Badge not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['badges'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.badges.some((existingBadge) => existingBadge.id === badge.id)) {
      throw new ConflictException('O emblema já foi resgatado por este usuário.');
    }

    user.badges.push(badge);
    await this.userRepository.save(user);

    const { users, ...result } = badge;

    return result;
  }

}
