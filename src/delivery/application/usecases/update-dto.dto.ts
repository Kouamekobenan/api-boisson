import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IDeliveryRepository } from "../interface/delivery-repository.interface";
import { UpdateDeliveryDto } from "../dtos/update-delivery-dto.dto";
import { Delivery } from "src/delivery/domain/entities/delivery.entity";

@Injectable()
export class UpdateDeliveryUseCase{
    constructor(
        @Inject('IDeliveryRepository')
        private readonly deliveryRepository:IDeliveryRepository
    ){}
    async execute(deliveryId:string, data:UpdateDeliveryDto):Promise<Delivery>{
        try {
            return this.deliveryRepository.updateDelivery(deliveryId, data)
        } catch (error) {
          console.error('une erreur lors de creation de la livraison:', error)
          throw new BadRequestException(`une erreur au niveau du service use-case: ${error.message}`)  
        }
    }
}
