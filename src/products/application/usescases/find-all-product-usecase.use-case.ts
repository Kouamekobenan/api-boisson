import { Inject, Injectable } from "@nestjs/common";
import { IProductRepository } from "../interface/product-repository.intrerface";
import { ProductEntity } from "src/products/domain/entities/product.entity";

@Injectable()

export class FindAllProductUseCase{
    constructor(
        @Inject('IProductRepository')
        private readonly productRepository:IProductRepository
    ){}
    async execute():Promise<ProductEntity[]>{
        return await this.productRepository.findAllProduct()
    }
}