import { DeliveryPerson } from "src/deliveryPerson/domain/entities/deliveryPerson";
import { DeliveryPersonDto } from "../dtos/deliveryPerson-dto.dto";
import { UpdateDeliveryDto } from "../dtos/update-dto.deliveryPerson.dto";

export interface IDeliveryPersonRepository{
    createdDeliveryPerson(data:DeliveryPersonDto):Promise<DeliveryPerson>
    updateDeliveryPerson(deliveryPersonId:string, data:UpdateDeliveryDto, ):Promise<DeliveryPerson>
    getAllDeliveryPerson():Promise<DeliveryPerson[]>
    deleteDeliveryPerson(deliveryPersonId:string):Promise<DeliveryPerson>
}
