import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto, ReorderPaymentMethodsDto } from './dto/payment-method.dto';

@Injectable()
export class PaymentMethodService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(userId: string, dto: CreatePaymentMethodDto) {
    // Auto-assign sortOrder if not provided
    if (dto.sortOrder === undefined) {
      const count = await this.prisma.paymentMethod.count({ where: { userId } });
      dto.sortOrder = count;
    }

    return this.prisma.paymentMethod.create({
      data: {
        userId,
        type: dto.type,
        label: dto.label,
        handle: dto.handle,
        sortOrder: dto.sortOrder,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdatePaymentMethodDto) {
    const method = await this.findOwned(userId, id);
    return this.prisma.paymentMethod.update({
      where: { id: method.id },
      data: dto,
    });
  }

  async delete(userId: string, id: string) {
    const method = await this.findOwned(userId, id);
    await this.prisma.paymentMethod.delete({ where: { id: method.id } });
    return { success: true };
  }

  async reorder(userId: string, dto: ReorderPaymentMethodsDto) {
    // Verify all IDs belong to this user
    const owned = await this.prisma.paymentMethod.findMany({
      where: { userId },
      select: { id: true },
    });
    const ownedIds = new Set(owned.map(m => m.id));
    for (const item of dto.order) {
      if (!ownedIds.has(item.id)) {
        throw new ForbiddenException(`Payment method ${item.id} not found`);
      }
    }

    // Batch update in transaction
    await this.prisma.$transaction(
      dto.order.map(item =>
        this.prisma.paymentMethod.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    return this.getAll(userId);
  }

  private async findOwned(userId: string, id: string) {
    const method = await this.prisma.paymentMethod.findUnique({ where: { id } });
    if (!method) throw new NotFoundException('Payment method not found');
    if (method.userId !== userId) throw new ForbiddenException();
    return method;
  }
}
