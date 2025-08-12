import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CreatePrductUseCase } from '../application/usescases/create-product.use-case';
import { ProductDto } from '../application/dtos/product-dto.dto';
import { ProductEntity } from '../domain/entities/product.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { FindAllProductUseCase } from '../application/usescases/find-all-product-usecase.use-case';
import { UpdateProductUseCase } from '../application/usescases/update-product.usecase';
import { UpdateProductDto } from '../application/dtos/update-dto.product-dto';
import { DeleteProductUseCase } from '../application/usescases/delete-product.use-case';
import { ByProductUseCase } from '../application/usescases/by-to-product.usecase';
import { FiterProductUseCase } from '../application/usescases/filtrage-product.usecase';
import { FilterProductDto } from '../application/dtos/filtrage-product.dto';
import { PaginateProductUseCase } from '../application/usescases/paginate-products.usecase';
import { PaginateDto } from '../application/dtos/paginate-product.dto';
import { LowerStockUseCase } from '../application/usescases/lower-stock.usecase';
import { GetByIdProductUseCase } from '../application/usescases/get-product-byId.usecase';
import { ProvisionningDto } from '../application/dtos/provisionning-product.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { SuccessResponse } from 'src/common/types/response-controller.type';
@Public()
@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreatePrductUseCase,
    private readonly findAllProductUseCase: FindAllProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly byProductUseCase: ByProductUseCase,
    private readonly fiterProductUseCase: FiterProductUseCase,
    private readonly paginateProductUseCase: PaginateProductUseCase,
    private readonly lowerStockUseCase: LowerStockUseCase,
    private readonly getByIdProductUseCase: GetByIdProductUseCase,
  ) {}
  @Post('tenant/:tenantId')
  @ApiOperation({
    summary: 'Créer un produit',
    description: 'Crée un nouveau produit pour un tenant donné.',
  })
  @ApiBody({ type: ProductDto, description: 'Données du produit à créer' })
  @ApiParam({
    name: 'tenantId',
    type: String,
    description: 'Identifiant du tenant',
    example: 'd5c1a27e-9831-4f84-b8d8-8472a0e5f3e3',
  })
  @ApiResponse({
    status: 201,
    description: 'Produit créé avec succès',
    type: ProductEntity,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async createProduct(
    @Param('tenantId') tenantId: string,
    @Body() dataProduct: ProductDto,
  ): Promise<SuccessResponse<ProductEntity>> {
    const product = await this.createProductUseCase.execute(
      tenantId,
      dataProduct,
    );
    return ResponseHelper.success(product);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un produit' })
  @ApiParam({
    name: 'id',
    description: "L'ID du produit à mettre à jour",
    type: String,
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Les nouvelles données du produit',
  })
  @ApiResponse({
    status: 200,
    description: 'Produit mis à jour avec succès',
    type: ProductEntity,
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProduct(
    @Param('id') productId: string,
    @Body() productData: UpdateProductDto,
  ): Promise<ProductEntity> {
    return await this.updateProductUseCase.execute(productId, productData);
  }

  @Get('/tenant/:tenantId')
  @ApiOperation({ summary: 'Récupérer tous les produits' })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les produits',
    type: [ProductEntity],
  })
  async findAllProduct(
    @Param('tenantId') tenantId: string,
  ): Promise<ProductEntity[]> {
    return await this.findAllProductUseCase.execute(tenantId);
  }

  @Get('paginate/:tenantId')
  @ApiOperation({
    summary: 'Paginer les produits',
    description: 'Récupère une liste paginée de produits',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des produits',
    type: [ProductEntity],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Numéro de la page (par défaut 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: "Nombre d'éléments par page (par défaut 10)",
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async paginate(
    @Query() query: PaginateDto,
    @Param('tenantId') tenantId: string,
  ) {
    const { data, total, page, limit } =
      await this.paginateProductUseCase.execute(
        tenantId,
        query.limit,
        query.page,
      );
    const response = ResponseHelper.paginated(data, total, page, limit);
    return response;
  }

  @Get('filter/:tenantId')
  @ApiOperation({
    summary: 'Filtrer les produits',
    description:
      'Filtre les produits par nom, prix, fournisseur avec pagination.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste filtrée des produits',
    type: [ProductEntity],
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Nom du produit (recherche partielle)',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Prix minimum',
    type: Number,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Prix maximum',
    type: Number,
  })
  @ApiQuery({
    name: 'supplierId',
    required: false,
    description: 'Identifiant du fournisseur',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de page',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: "Nombre d'éléments par page",
    type: Number,
    example: 10,
  })
  async filter(
    @Param('tenantId') tenantId: string,
    @Query() filters: FilterProductDto,
  ) {
    return await this.fiterProductUseCase.execute(tenantId, filters);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer un produit',
    description: 'Supprime un produit par son ID',
  })
  @ApiParam({
    name: 'id',
    description: "L'ID du produit à supprimer",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Produit supprimé avec succès',
    type: Boolean,
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async deleteProduct(@Param('id') productId: string): Promise<boolean> {
    await this.deleteProductUseCase.execute(productId);
    return true;
  }
  @Patch('/provisioning/:productId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Approvisionner un produit (ajout de stock)' })
  @ApiResponse({
    status: 200,
    description: 'Stock mis à jour avec succès',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation ou stock insuffisant',
  })
  @ApiBody({
    type: ProvisionningDto,
    description: 'Données d’approvisionnement du produit',
  })
  async provisioning(
    @Param('productId') productId: string,
    @Body() products: ProvisionningDto,
  ): Promise<ProductEntity> {
    try {
      return await this.byProductUseCase.execute(productId, products);
    } catch (error) {
      throw new BadRequestException(
        `Erreur d'approvisionnement : ${error.message}`,
      );
    }
  }

  @Get('lower/:tenantId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Lister les produits avec un stock critique' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Numéro de page (par défaut 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Nombre d’éléments par page (par défaut 10)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des produits dont le stock est inférieur au seuil critique',
    type: ProductEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la récupération des produits',
  })
  async lower(
    @Param('tenantId') tenantId: string,
    @Query() query: PaginateDto,
  ) {
    return await this.lowerStockUseCase.execute(
      tenantId,
      query.page,
      query.limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un produit par ID' })
  @ApiParam({
    name: 'id',
    description: "L'identifiant unique du produit",
    type: String,
    example: 'abc123xyz',
  })
  @ApiResponse({
    status: 200,
    description: 'Produit trouvé avec succès',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Produit non trouvé',
  })
  async findById(
    @Param('id') productId: string,
  ): Promise<ProductEntity | null> {
    return await this.getByIdProductUseCase.execute(productId);
  }
}
