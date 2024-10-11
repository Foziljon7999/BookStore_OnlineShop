import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Column } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Book } from "src/book/entities/book.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: false,
        default: () => `'ORD-' || extract(epoch from now())::bigint`, 
      })
      orderNumber: string;

    @Column({ type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    date: Date;

    @ManyToOne(() => User, (user) => user.orders)
    user: User

    @ManyToMany(() => Book)
    @JoinTable()
    books: Book[]

    @Column({ type: 'decimal'})
    totalPrice: number;

    @Column({ default: 'pending'})
    status: string;
}