import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IProductRepository } from "../interface/product-repository.intrerface";
import { ProductEntity } from "src/products/domain/entities/product.entity";

@Injectable()
export class ByProductUseCase{
    constructor(
        @Inject('IProductRepository')
        private readonly productRepository: IProductRepository
    ){}

    async execute(productId:string, quantity:number):Promise<ProductEntity>{
        try {
           return await this.productRepository.byProduct(productId, quantity)
        } catch (error) {
            throw new BadRequestException(`La création de l\'achat à echouer!`)
        }
    }
}