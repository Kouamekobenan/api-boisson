import { BadGatewayException, Inject, Injectable } from "@nestjs/common";
import { IDeliveryPersonRepository } from "../interface/deliveryPerson-repository.interface";
import { DeliveryPerson } from "src/deliveryPerson/domain/entities/deliveryPerson";

@Injectable()

export class FindAllDeliveryUseCase{
    constructor(@Inject('IDeliveryPersonRepository')
private readonly deliveryPersonRepository:IDeliveryPersonRepository){}

async execute(tenantId:string):Promise<DeliveryPerson[]>{
    try {
        const deliveryPerson = await this.deliveryPersonRepository.getAllDeliveryPerson(tenantId)
        return deliveryPerson
    } catch (error) {
        throw new BadGatewayException('use-case:', error.message)
    }
}
}