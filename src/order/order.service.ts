import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CartService } from 'src/cart/cart.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) 
    private orderRepository: Repository<Order>,
    private cartService: CartService 
  ) {}

  async createOrder(user: User): Promise<Order> {
    const cart = await this.cartService.getCartByUserId(user.id);

    if (!cart || cart.books.length === 0) {
      throw new Error('Savatcha bo\'sh');
    }

    console.log('Cart Books:', cart.books);

    const totalPrice = cart.books.reduce((sum, cartBook) => {
      const bookPrice = cartBook.book?.price
      if(bookPrice === undefined){
        throw new Error(`Book price not found for book ID: ${cartBook.book.id}`)
      }
      return sum + bookPrice * cartBook.quantity
    }, 0);

    const newOrder = this.orderRepository.create({
      user,
      books: cart.books.map(cartBook => cartBook.book),
      totalPrice,
      status: 'pending',
    });

    await this.orderRepository.save(newOrder);

    return newOrder;
  }

  async getOrdersByUser(user: { id : number}): Promise<Order[]> {
    return this.orderRepository.find({ where: { user }, relations: ['books'] });
  }
}

