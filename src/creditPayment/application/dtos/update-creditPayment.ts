import { PartialType } from '@nestjs/swagger';
import { CreateCreditPaymentDto } from './create-creditPayment.dto';
export class UpdateCreditPaymentDto extends PartialType(
  CreateCreditPaymentDto,
) {}
