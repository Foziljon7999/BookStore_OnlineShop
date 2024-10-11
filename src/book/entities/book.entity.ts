import { Cart } from "src/cart/entities/cart.entity";

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('book')
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column('decimal')
    price: number;

    @Column({ default: true})
    inStock: boolean;

    @Column({ type: 'text'})
    description: string;

    @Column()
    category: string;

    @OneToMany(() => Cart, (cart) => cart.books)
    cart: Cart[];
}