import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCartDto } from './dto/create-cart.dto';
import { BookService } from 'src/book/book.service';


@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly bookService: BookService
  ) {}

@UseGuards(AuthGuard)
  @Post('add')
  async addToCart(@Request() req, @Body() body: CreateCartDto) {
    const userId = req.user.id; 
    const { bookId, quantity } = body 
    return this.cartService.addToCart(userId, bookId, quantity);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getCart(@Request() req) {
    return this.cartService.getCartByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:bookId')
  async updateQuantity(@Request() req, @Param('bookId') bookId: number, @Body() body: { quantity: number }) {
    return this.cartService.updateBookQuantity(req.user.id, bookId, body.quantity);
  }

  @UseGuards(AuthGuard)
  @Delete('remove/:bookId')
  async removeBook(@Request() req, @Param('bookId') bookId: number) {
    console.log('Removing Book ID:', bookId);
    return this.cartService.delete(req.user.id, bookId);
  }
}
