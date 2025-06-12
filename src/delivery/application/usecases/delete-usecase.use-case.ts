import { Inject, Injectable } from "@nestjs/common";
import { IDeliveryRepository } from "../interface/delivery-repository.interface";

@Injectable()

export class DeleteDeliveryUseCase{
    constructor(@Inject('IDeliveryRepository')
private readonly deliveryRepository: IDeliveryRepository){}

    async execute(deliveryId:string):Promise<Boolean>{
        try {
        await this.deliveryRepository.DeleteDelivery(deliveryId)
         return true
        } catch (error) {
            return false
        }
    }
}
