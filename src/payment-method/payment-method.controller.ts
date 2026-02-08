import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto, ReorderPaymentMethodsDto } from './dto/payment-method.dto';

@Controller('payment-methods')
@UseGuards(AuthGuard('jwt'))
export class PaymentMethodController {
  constructor(private paymentMethodService: PaymentMethodService) {}

  @Get()
  getAll(@Req() req: any) {
    return this.paymentMethodService.getAll(req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreatePaymentMethodDto) {
    return this.paymentMethodService.create(req.user.id, dto);
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdatePaymentMethodDto) {
    return this.paymentMethodService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.paymentMethodService.delete(req.user.id, id);
  }

  @Patch('reorder')
  reorder(@Req() req: any, @Body() dto: ReorderPaymentMethodsDto) {
    return this.paymentMethodService.reorder(req.user.id, dto);
  }
}
