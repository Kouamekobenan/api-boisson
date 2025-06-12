import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ProductDto } from "../dtos/product-dto.dto";
import { ProductEntity } from "src/products/domain/entities/product.entity";
import { IProductRepository } from "../interface/product-repository.intrerface";

@Injectable()

export class UpdateProductUseCase{
    constructor(
        @Inject('IProductRepository')
        private readonly productRepository: IProductRepository
    ){}
    async execute(productId:string, productData:ProductDto):Promise<ProductEntity>{
        try {
            const isProductExist= await this.productRepository.findById(productId)
            if(!isProductExist){
                throw new BadRequestException('Product is no exist!')
            }
            if(productData.price< 0 ){
                throw new BadRequestException("le prix ne peut être inferieur à zéro")
            }
            return await this.productRepository.updateProcut(productId, productData)
        } catch (error) {
            throw new BadRequestException(`error use-case: ${error.message}`)
        }
    }
}