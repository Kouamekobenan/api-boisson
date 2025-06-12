import { SupplierEntity } from "src/supplier/domain/entities/supplier.entity";
import { SupplierDto } from "../dtos/supplier-dto.dto";
import { UpdateSupplierDto } from "../dtos/update-dto.dto";

export interface ISupplierRepository{
    create(data:SupplierDto):Promise<SupplierEntity>
    findSupplierById(supplierId:string):Promise<SupplierEntity>
    findAll():Promise<SupplierEntity[]>
    update(supplierId:string, data:UpdateSupplierDto):Promise<SupplierEntity>
    deleted(supplierId:string):Promise<void>
}