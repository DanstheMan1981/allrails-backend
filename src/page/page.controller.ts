import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('p')
export class PageController {
  constructor(private prisma: PrismaService) {}

  @Get(':username')
  async getPublicPage(@Param('username') username: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        user: { select: { name: true } },
      },
    });

    if (!profile) throw new NotFoundException('Page not found');

    const paymentMethods = await this.prisma.paymentMethod.findMany({
      where: { userId: profile.userId, active: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        type: true,
        label: true,
        handle: true,
        sortOrder: true,
      },
    });

    return {
      username: profile.username,
      displayName: profile.displayName || profile.user.name,
      avatar: profile.avatar,
      bio: profile.bio,
      paymentMethods,
    };
  }
}
