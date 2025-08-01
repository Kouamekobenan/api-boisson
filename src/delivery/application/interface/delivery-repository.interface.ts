import { DeliveryDto } from '../dtos/delivery-dto.dto';
import { Delivery } from 'src/delivery/domain/entities/delivery.entity';
import { UpdateDeliveryDto } from '../dtos/update-delivery-dto.dto';
import { DeliveryStatus } from 'src/delivery/domain/enums/deliveryStatus.enums';

export interface IDeliveryRepository {
  created(deliveryPersonId: string, data: DeliveryDto): Promise<Delivery>;
  findAllDelivery(): Promise<Delivery[]>;
  updateDelivery(
    deliveryId: string,
    data: UpdateDeliveryDto,
  ): Promise<Delivery>;
  DeleteDelivery(deliveryId: string): Promise<void>;
  findDetails(
    deliveryPersonId: string,
    startDate: string,
    endDate: string,
  ): Promise<Delivery[]>;
  findById(
    deliveryId: string,
  ): Promise<{ data: Delivery & { totalPrice: number } }>;
  validateDeliveryById(
    deliveryId: string,
    data: DeliveryDto,
  ): Promise<Delivery>;
  annulateDelivery(deliveryId: string): Promise<Delivery>;
  paginate(
    limit: number,
    page: number,
    search: string,
    status: DeliveryStatus | 'ALL',
  ): Promise<{
    data: (Delivery & { totalPrice: number })[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }>;
  history(deliveryPersonId: string): Promise<Delivery[]>;
  process(): Promise<Delivery[]>;
  toDay(): Promise<Delivery[]>;
  findByDateRange(startDate: string, endDate: string): Promise<Delivery[]>;
}
