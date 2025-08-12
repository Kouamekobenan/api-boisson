import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IProductRepository } from "../interface/product-repository.intrerface";
import { ProductEntity } from "src/products/domain/entities/product.entity";
import { ProvisionningDto } from "../dtos/provisionning-product.dto";

@Injectable()
export class ByProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    productId: string,
    products: ProvisionningDto,
  ): Promise<ProductEntity> {
    try {
      const product =await this.productRepository.findById(productId)
      if (!product) {
        throw new NotFoundException('Failled to retrieve product')
      }
      return await this.productRepository.provisioning(productId, products);
    } catch (error) {
      throw new BadRequestException(`La création de l\'achat à echouer!`);
    }
  }
}