import { DeliveryPersonDto } from 'src/deliveryPerson/application/dtos/deliveryPerson-dto.dto';
import { DeliveryPerson } from '../entities/deliveryPerson';
import { Prisma, DeliveryPerson as PrismaDeliveryPerson } from '@prisma/client';
import { UpdateDeliveryDto } from 'src/deliveryPerson/application/dtos/update-dto.deliveryPerson.dto';

export class DeliveryPersonMapper {
  toDomain(dataDeliveryPerson: PrismaDeliveryPerson): DeliveryPerson {
    return new DeliveryPerson(
      dataDeliveryPerson.id,
      dataDeliveryPerson.name,
      dataDeliveryPerson.phone,
      new Date(dataDeliveryPerson.createdAt),
      new Date(dataDeliveryPerson.updatedAt),
      dataDeliveryPerson.tenantId,
    );
  }
  toApplication(
    dataDeliveryperson: DeliveryPersonDto,
  ): Prisma.DeliveryPersonCreateInput {
    return {
      name: dataDeliveryperson.name,
      phone: dataDeliveryperson.phone,
      tenant: { connect: { id: dataDeliveryperson.tenantId } },
    };
  }
  toUpdateDeliveryPerson(deliveryPersonData: UpdateDeliveryDto): any {
    const dataDeliveryPerson: any = {};
    if (deliveryPersonData.name) {
      dataDeliveryPerson.name = deliveryPersonData.name;
    }
    if (deliveryPersonData.phone) {
      dataDeliveryPerson.phone = deliveryPersonData.phone;
    }
    return dataDeliveryPerson;
  }
}
