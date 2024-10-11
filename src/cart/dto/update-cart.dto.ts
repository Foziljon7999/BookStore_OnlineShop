import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';

export class UpdateOrderDto extends PartialType(CreateCartDto) {}
