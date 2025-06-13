import { Decimal } from '@prisma/client/runtime/library'; // ou runtime selon ta version

export function toSafeNumber(value: number | Decimal): number {
  return value instanceof Decimal ? value.toNumber() : value;
}
