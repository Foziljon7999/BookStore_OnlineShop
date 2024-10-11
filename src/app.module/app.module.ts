import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Order } from 'src/order/entities/order.entity';
import { OrderModule } from 'src/order/order.module';
import { Book } from 'src/book/entities/book.entity';
import { BookModule } from 'src/book/book.module';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartModule } from 'src/cart/cart.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CartBook } from 'src/cart/entities/cart.book.entity';


@Module({
  imports: [ 
    ConfigModule.forRoot({
     isGlobal: true,
     envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1111',
    database: 'book',
    entities: [User, Order, Book, Cart, CartBook],
    synchronize: true,
    // logging: true
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', './src/uploads'),
  }),
  UsersModule,
  OrderModule,
  BookModule,
  CartModule,
  AuthModule,
],
  controllers: [AppController],
  providers: [AppService],
},)
export class AppModule {}
