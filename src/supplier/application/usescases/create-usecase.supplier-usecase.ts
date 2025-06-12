import { BadGatewayException, Inject, Injectable } from "@nestjs/common";
import { ISupplierRepository } from "../interface/supplier-interface.repository";
import { SupplierDto } from "../dtos/supplier-dto.dto";
import { SupplierEntity } from "src/supplier/domain/entities/supplier.entity";

@Injectable()
export class CreateSupplierUseCase{
    constructor(
        @Inject('ISupplierRepository')
        private readonly supplierRepository:ISupplierRepository
    ){}
    async execute(data:SupplierDto):Promise<SupplierEntity>{
        try {
            return await this.supplierRepository.create(data)
        } catch (error) {
            throw new BadGatewayException(`on error during created supplier:use-case:${error.message}`)
        }
    }
}