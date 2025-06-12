import { Inject, Injectable } from "@nestjs/common";
import { IDeliveryRepository } from "../interface/delivery-repository.interface";
import { DeliveryDto } from "../dtos/delivery-dto.dto";
import { Delivery } from "src/delivery/domain/entities/delivery.entity";

@Injectable()
export class CreateDeliveryUseCase{
    constructor(@Inject('IDeliveryRepository',)
  private readonly deliveryRepository: IDeliveryRepository){}
  async execute(deliveryId:string, data: DeliveryDto):Promise<Delivery>{
    try {
        return await this.deliveryRepository.created(deliveryId, data)
    } catch (error) {
        console.error(`error: use-case: ${error.message} `)
        throw new error
    }
  }
}