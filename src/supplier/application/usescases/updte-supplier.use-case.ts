import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ISupplierRepository } from "../interface/supplier-interface.repository";
import { UpdateSupplierDto } from "../dtos/update-dto.dto";
import { SupplierEntity } from "src/supplier/domain/entities/supplier.entity";

@Injectable()

export class SupplierUpdateUseCase{
    constructor(
        @Inject('ISupplierRepository')
        private readonly supplierRepository:ISupplierRepository                    

    ){}
    async execute(supplierId:string, data:UpdateSupplierDto):Promise<SupplierEntity>{
        try {
            const isExist = await this.supplierRepository.findSupplierById(supplierId)
            if(!isExist){
                throw new BadRequestException('ce fournisseur n\'existe pas')
            }
            return await this.supplierRepository.update(supplierId,data)
        } catch (error) {
            throw new BadRequestException(`error on use-case: ${error.message}`)
        }
    }
}