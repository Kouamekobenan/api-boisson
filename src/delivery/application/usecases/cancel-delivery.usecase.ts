import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IDeliveryRepository } from "../interface/delivery-repository.interface";
import { Delivery } from "src/delivery/domain/entities/delivery.entity";

@Injectable()

export class CanceledDeliveryUseCase{
    constructor(@Inject('IDeliveryRepository')
private readonly deliveryRepository:IDeliveryRepository){}
    async execute(deliveryId:string):Promise<Delivery>{
        try {
            
            return this.deliveryRepository.annulateDelivery(deliveryId)
        } catch (error) {
            throw new BadRequestException(`error use-case: ${error.message}`) 
        }
    }
}