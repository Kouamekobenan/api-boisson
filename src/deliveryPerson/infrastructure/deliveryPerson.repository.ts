import { PrismaService } from "src/prisma/prisma.service";
import { DeliveryPersonMapper } from "../domain/mappers/deliveryPerson-mapper.mapper";
import { BadRequestException, Injectable } from "@nestjs/common";
import { DeliveryPerson } from "../domain/entities/deliveryPerson";
import { DeliveryPersonDto } from "../application/dtos/deliveryPerson-dto.dto";
import { IDeliveryPersonRepository } from "../application/interface/deliveryPerson-repository.interface";
import { UpdateDeliveryDto } from "../application/dtos/update-dto.deliveryPerson.dto";


@Injectable()
export class DeliveryPersonRepository implements IDeliveryPersonRepository{
    constructor(
        private readonly prisma:PrismaService,
        private readonly mapper:DeliveryPersonMapper,
        
    ){}
    async createdDeliveryPerson(data:DeliveryPersonDto):Promise<DeliveryPerson>{
       try {
        const deliveryPerson= await this.mapper.toApplication(data)
        const created =await this.prisma.deliveryPerson.create({
            data: deliveryPerson,
        })
        return this.mapper.toDomain(created)
       } catch (error) {
        console.error("deliveryPersonRepository:", error)
        throw new BadRequestException(`error: deliveryPersonRepository: ${error.message}`)
       }
    }
   async updateDeliveryPerson(deliveryPersonId:string, data: UpdateDeliveryDto): Promise<DeliveryPerson> {
      try{
        const deliveryPerson = this.mapper.toUpdateDeliveryPerson(data)
        const updated =await this.prisma.deliveryPerson.update({
          where: {id: deliveryPersonId},
          data: deliveryPerson,
        })
        return this.mapper.toDomain(updated)

      }catch(err){
        console.error(`updateDeliveryPerson: ${err.message}`)
        throw new BadRequestException(`error: updateDeliveryPerson: ${err.message}`)
      }
    }
    async getAllDeliveryPerson(): Promise<DeliveryPerson[]> {
      try {
         const deliveryPerson= await this.prisma.deliveryPerson.findMany()
         return deliveryPerson.map((devery) => this.mapper.toDomain(devery))
      } catch (error) {
        throw new BadRequestException(`une erreur lors de requête ${error.message}`)
      }
    }
    // DELIVERYPERSON DELETE 
    async deleteDeliveryPerson(deliveryPersonId: string): Promise<DeliveryPerson> {
      try {
        const deliveryPerson =await this.prisma.deliveryPerson.delete({
          where: { id:deliveryPersonId }
        })
        return this.mapper.toDomain(deliveryPerson)
      } catch (error) {
        throw new BadRequestException(`deleteDeliveryPerson: ${error.message}`)
      }
    }  
}