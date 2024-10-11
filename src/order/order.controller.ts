import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { log } from 'util';

@Controller('orders')
export class OrderController {
  constructor(
     readonly orderService: OrderService,
    ) {}
  
@UseGuards(AuthGuard)
  @Post('create')
  async createOrder(@Request() req) {
    const user = req.user;
    return this.orderService.createOrder(user);
  }

@UseGuards(AuthGuard)
  @Get()
  async getUserOrders(@Request() req) {
    const { id, name, role } = req.user;
    const user = { id, name, role }
    return this.orderService.getOrdersByUser(user);
  }
}


