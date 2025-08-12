import { SupplierEntity } from "src/supplier/domain/entities/supplier.entity";
import { SupplierDto } from "../dtos/supplier-dto.dto";
import { UpdateSupplierDto } from "../dtos/update-dto.dto";
import { SuccessResponse } from "src/common/types/response-controller.type";

export interface ISupplierRepository {
  create(data: SupplierDto): Promise<SuccessResponse<SupplierEntity>>;
  findSupplierById(supplierId: string): Promise<SupplierEntity | null>;
  findAll(tenantId:string): Promise<SupplierEntity[]>;
  update(supplierId: string, data: UpdateSupplierDto): Promise<SupplierEntity>;
  deleted(supplierId: string): Promise<void>;
}