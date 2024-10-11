// dto/create-order.dto.ts
import { IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  books: number[];

  @IsNumber()
  totalPrice: number;
}
