import { BadGatewayException, BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ISupplierRepository } from "../interface/supplier-interface.repository";

@Injectable()

export class DeleteSupplierUseCase{
    constructor(@Inject('ISupplierRepository')
private readonly supplierRepository:ISupplierRepository){}
async execute(supplierId:string):Promise<boolean>{
        try {
         const isExist = await this.supplierRepository.findSupplierById(supplierId)
        if(!isExist){
            throw new BadGatewayException('Le fournisseur que vous vouler supprimer n\'exist pas!')
        }
       const supplier= await this.supplierRepository.deleted(supplierId)
       console.log(supplier)
        return true
      } catch (error) {
          throw new BadRequestException(`error use-case: ${error.message}`)  
    }
  }
}