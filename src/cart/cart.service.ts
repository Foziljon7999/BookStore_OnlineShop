import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { Book } from 'src/book/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { CartBook } from './entities/cart.book.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartBook)
    private cartBookRepository: Repository<CartBook>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>
  ) { }

  async addToCart(userId: number, bookId: number, quantity: number): Promise<Cart> {
    try {
      const book = await this.bookRepository.findOne({ where: { id: bookId } })
      console.log(bookId);

      if (!book) {
        throw new NotFoundException('Book not found')
      }

      let cart = await this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['books', 'books.book'] });

      if (!cart) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        cart = this.cartRepository.create({ user, books: [] });
      }

      const existingCartBook = cart.books.find(cartBook => cartBook.book.id === book.id);

      if (existingCartBook) {
        existingCartBook.quantity += quantity;
      } else {
        const cartBook = this.cartBookRepository.create({ cart, book, quantity });
        cart.books.push(cartBook);
        await this.cartBookRepository.save(cartBook)
      }

      return await this.cartRepository.save(cart);

    } catch (error) {
      console.error('Error in addToCart:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while adding to cart');
    }
  }


  async getCartByUserId(userId: number): Promise<Cart> {
    return this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['books', 'books.book'] });
  }

  async updateBookQuantity(userId: number, bookId: number, quantity: number): Promise<Cart> {
    try {
      const cart = await this.getCartByUserId(userId);
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const existingBookIndex = cart.books.findIndex(b => b.id === Number(bookId));

      if (existingBookIndex > -1) {
        const existingBook = cart.books[existingBookIndex];
        console.log('Existing Book:', existingBook);
        if (quantity <= 0) {
          cart.books.splice(existingBookIndex, 1);
        } else {
          existingBook.quantity = quantity;
        }
        const savedCart = await this.cartRepository.save(cart);
        console.log('Saved Cart: ', savedCart);

        return savedCart
      } else {
        throw new NotFoundException('Book not found in the cart');
      }

    } catch (error) {
      console.error('Error updating book quantity:', error);
      throw error;
    }
  }

  async delete(userId: number, bookId: number): Promise<Cart> {
    const cart = await this.getCartByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    console.log('Current Cart:', cart);

    const bookToRemoveIndex = cart.books.findIndex(b => b.id === Number(bookId))
    if (bookToRemoveIndex === -1) {
      throw new NotFoundException('Book not found in the cart')
    }

    const bookIdToDelete = cart.books[bookToRemoveIndex].id

    cart.books.splice(bookToRemoveIndex, 1)

    const result = await this.cartBookRepository.delete({ id: bookIdToDelete })
    console.log('Delete result: ', result);

    return this.cartRepository.save(cart);
  }
}
