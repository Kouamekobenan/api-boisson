import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { DirectSale } from "src/directSale/domain/entities/directSale.entity";
import { DirectSaleRepositoryName, IDirectSaleRepository } from "src/directSale/domain/interfaces/directSale-repository.interface";

@Injectable()
export class FindAllDirecteSaleUseCase{
    private readonly logger =new Logger(FindAllDirecteSaleUseCase.name)
    constructor(
        @Inject(DirectSaleRepositoryName)
        private readonly directeSaleRepository:IDirectSaleRepository
    ){}
    async execute(tenantId:string):Promise<DirectSale[]>{
        try {
            const directeSales = await this.directeSaleRepository.findAll(tenantId)
            return directeSales
        } catch (error) {
         this.logger.error(`Failled to retrieve directe sale`, error.stack)   
         throw new BadRequestException(`Failled to retrieve directe sale`, error.stack)
        }
    }
}
