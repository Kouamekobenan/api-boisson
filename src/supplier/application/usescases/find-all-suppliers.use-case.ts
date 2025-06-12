import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ISupplierRepository } from "../interface/supplier-interface.repository";
import { SupplierEntity } from "src/supplier/domain/entities/supplier.entity";

@Injectable()
export class FindAllSupplierUseCase{
    constructor(
        @Inject('ISupplierRepository')
        private readonly supplierRepository:ISupplierRepository
    ){}
    async execute():Promise<SupplierEntity[]>{
        try {
            return await this.supplierRepository.findAll()
        } catch (error) {
            throw new BadRequestException(`error use-case:${error.message}`)
        }
    }
}