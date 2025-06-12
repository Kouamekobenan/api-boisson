import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IProductRepository } from "../interface/product-repository.intrerface";

@Injectable()
export class DeleteProductUseCase{
    constructor(
        @Inject('IProductRepository')
        private readonly productRepository: IProductRepository
    ){}

    async execute(productId:string):Promise<Boolean>{
        try {
            const isProductExist =await this.productRepository.findById(productId)
            if (!isProductExist) {
                throw new BadRequestException('ce produit n\'exist pas!')
            }
            await this.productRepository.deleteProduct(productId)
            return true
        } catch (error) {
            throw new BadRequestException(`error use-case-product: ${error.message}`)
        }
    }
}