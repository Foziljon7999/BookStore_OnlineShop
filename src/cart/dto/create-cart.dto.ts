import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
