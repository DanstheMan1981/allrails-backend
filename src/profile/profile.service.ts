import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    return (await this.prisma.profile.findUnique({ where: { userId } })) ?? {};
  }

  async upsertProfile(userId: string, dto: UpsertProfileDto) {
    // Check username uniqueness (exclude own profile)
    const existing = await this.prisma.profile.findUnique({
      where: { username: dto.username },
    });
    if (existing && existing.userId !== userId) {
      throw new ConflictException('Username already taken');
    }

    return this.prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        username: dto.username,
        displayName: dto.displayName,
        avatar: dto.avatar,
        bio: dto.bio,
      },
      update: {
        username: dto.username,
        displayName: dto.displayName,
        avatar: dto.avatar,
        bio: dto.bio,
      },
    });
  }
}
