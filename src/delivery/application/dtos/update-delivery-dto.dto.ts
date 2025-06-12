import { ApiProperty } from "@nestjs/swagger";
import { DeliveryStatus } from "src/delivery/domain/enums/deliveryStatus.enums";

export class UpdateDeliveryDto{
     @ApiProperty({
            description: "Statut actuel de la livraison",
            example: 'PENDING',
            enum: DeliveryStatus,
        })
    status:DeliveryStatus
}