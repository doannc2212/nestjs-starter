import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
