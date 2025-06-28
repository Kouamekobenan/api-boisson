import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IProductRepository } from "../interface/product-repository.intrerface";
import { ProductEntity } from "src/products/domain/entities/product.entity";

@Injectable()
export class GetByIdProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}
  async execute(productId:string):Promise<ProductEntity | null>{
    try {
        return await this.productRepository.findById(productId)
    } catch (error) {
        throw new BadRequestException('Failled to retrieve product with ID')
    }
  }
}
