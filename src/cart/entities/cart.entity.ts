import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Book } from "src/book/entities/book.entity";
import { CartBook } from "./cart.book.entity";

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.cart)
    @JoinColumn({ name: 'userId' })
    user: User

    @OneToMany(() => CartBook, book => book.cart, { cascade: true})
    books: CartBook[];
   
    
}