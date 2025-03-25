import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddItemRequestDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
