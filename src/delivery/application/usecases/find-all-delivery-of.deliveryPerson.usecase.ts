import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IDeliveryRepository } from "../interface/delivery-repository.interface";
import { Delivery } from "src/delivery/domain/entities/delivery.entity";

@Injectable()

export class FindAllDeliveryOfDeliveryPersonUsecase{
    constructor(
        @Inject('IDeliveryRepository')
        private readonly deliveryRepository:IDeliveryRepository
    ){}
    async execute(deleveryPersonId:string, startDate:string, endDate:string):Promise<Delivery[]>{
        try {
            return await this.deliveryRepository.findDetails(deleveryPersonId, startDate, endDate)
        } catch (error) {
          throw new BadRequestException(`error on use-case: ${error.message}`)  
        }
    }
}