import { ApiProperty } from '@nestjs/swagger';

export class DeliveryPersonDto {
    @ApiProperty({ example: 'John Doe', description: "Nom du livreur" })
    name: string;

    @ApiProperty({ example: '+123456789', description: "Numéro de téléphone du livreur", required: false })
    phone?: string;
}
