import { Inject, Injectable } from "@nestjs/common";
import { IDeliveryPersonRepository } from "../interface/deliveryPerson-repository.interface";
import { UpdateDeliveryDto } from "../dtos/update-dto.deliveryPerson.dto";
import { DeliveryPerson } from "src/deliveryPerson/domain/entities/deliveryPerson";

@Injectable()
export class UpdateDeliveryUseCase{
    constructor(
        @Inject('IDeliveryPersonRepository')
        private readonly deliveryPersonRepository:IDeliveryPersonRepository){}
        async execute(deliveryPersonId:string, data:UpdateDeliveryDto, ):Promise<DeliveryPerson>{
            try {
                return await this.deliveryPersonRepository.updateDeliveryPerson(deliveryPersonId, data)
            } catch (error) {
                throw new Error('Unable to update delivery person')
            }

        }
}