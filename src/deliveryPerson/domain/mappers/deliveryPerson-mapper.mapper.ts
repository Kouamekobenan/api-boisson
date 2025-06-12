import { DeliveryPersonDto } from "src/deliveryPerson/application/dtos/deliveryPerson-dto.dto";
import { DeliveryPerson } from "../entities/deliveryPerson";
import { DeliveryPerson as PrismaDeliveryPerson } from "@prisma/client";
import { UpdateDeliveryDto } from "src/deliveryPerson/application/dtos/update-dto.deliveryPerson.dto";

export class DeliveryPersonMapper{
     undefined:string= 'monUndefined'
    toDomain(dataDeliveryPerson: PrismaDeliveryPerson):DeliveryPerson{
        return new DeliveryPerson(
            dataDeliveryPerson.id,
            dataDeliveryPerson.name,
            dataDeliveryPerson.phone ?? this.undefined,
            new Date(dataDeliveryPerson.createdAt),
            new Date(dataDeliveryPerson.updatedAt)
        )
    }
    toApplication(dataDeliveryperson:DeliveryPersonDto):any{
        return{
            name:dataDeliveryperson.name,
            phone:dataDeliveryperson.phone
        }
    }
    toUpdateDeliveryPerson(deliveryPersonData: UpdateDeliveryDto):any{
        const dataDeliveryPerson:any ={}
        if(deliveryPersonData.name){
            dataDeliveryPerson.name =deliveryPersonData.name
        }
        if(deliveryPersonData.phone){
            dataDeliveryPerson.phone = deliveryPersonData.phone
        }
        return dataDeliveryPerson

    }
}