import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class PushSubscriptionKeysDto {
  @ApiProperty({
    description: 'Clé p256dh Web Push',
    example: 'BNcX9Jv5s5uR6YwX7Pq...',
  })
  @IsString()
  @IsNotEmpty()
  p256dh: string;

  @ApiProperty({
    description: 'Clé auth Web Push',
    example: 'z6H8s1Q...',
  })
  @IsString()
  @IsNotEmpty()
  auth: string;
}

export class PushSubscriptionDto {
  @ApiProperty({
    description: "Endpoint généré par le navigateur pour l'abonnement Web Push",
    example: 'https://fcm.googleapis.com/fcm/send/cCkb4Fg....',
  })
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @ApiProperty({
    description: "Durée d'expiration de l'abonnement",
    required: false,
    example: null,
  })
  @IsOptional()
  expirationTime?: number | null;

  @ApiProperty({
    description: 'Clés WebPush pour la sécurisation de la notification',
    type: PushSubscriptionKeysDto,
  })
  @IsObject()
  keys: PushSubscriptionKeysDto;
}
