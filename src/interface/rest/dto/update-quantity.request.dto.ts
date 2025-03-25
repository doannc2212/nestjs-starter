import { IsNumber, Min } from 'class-validator';

export class UpdateQuantityRequestDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}
