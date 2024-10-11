import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Book } from 'src/book/entities/book.entity';

@Entity('cart_book')
export class CartBook {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, cart => cart.books)
    cart: Cart;

    @ManyToOne(() => Book)
    book: Book; 

    @Column()
    quantity: number; 
}
