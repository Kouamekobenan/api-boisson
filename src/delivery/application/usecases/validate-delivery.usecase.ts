import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IDeliveryRepository } from "../interface/delivery-repository.interface";
import { DeliveryDto } from "../dtos/delivery-dto.dto";
import { Delivery } from "src/delivery/domain/entities/delivery.entity";
import { DeliveryStatus } from "src/delivery/domain/enums/deliveryStatus.enums";

@Injectable()
export class ValidateDeliveryUseCase{
    constructor(
        @Inject('IDeliveryRepository')
        private readonly deliveryRepository:IDeliveryRepository
    ){}

    async execute(deliveryPersonId:string, data:DeliveryDto):Promise<Delivery>{
        try {
            // const delivery = await this.deliveryRepository.findById(deliveryPersonId)
            // if(delivery.getStatus() !== DeliveryStatus.IN_PROGRESS){
            //     throw new BadRequestException("seule les livraison en cours peut être validés!")
            // }
            return this.deliveryRepository.validateDeliveryById(deliveryPersonId, data)
        } catch (error) {
            throw new BadRequestException(`error use-caseSSS: ${error.message}`) 
        }
    }
}
