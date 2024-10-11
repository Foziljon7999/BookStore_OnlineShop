import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Book } from 'src/book/entities/book.entity';
import { CartBook } from './entities/cart.book.entity';
import { UsersModule } from 'src/users/users.module';
import { BookModule } from 'src/book/book.module';


@Module({
  imports: [TypeOrmModule.forFeature([Cart, Book, CartBook]), UsersModule, BookModule
],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule {}
