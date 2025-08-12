import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryProductUseCase } from '../application/usescases/create-category.usecase';
import { CategoryProductDto } from '../application/dtos/create-category.dto';
import { CategoryProduct } from '../domain/entities/category.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { FindCategoryProductByIdUseCase } from '../application/usescases/find-category-product-byId.usecase';
import { FilterCategoryProductUseCase } from '../application/usescases/filter-category-product.usecase';
import { PaginateDto } from '../application/dtos/paginate-category-product.dto';
import { PaginateCategoryProductUseCase } from '../application/usescases/pagination-category.usecase';
import { DeleteCategoryProductUseCase } from '../application/usescases/delete-category-product.usecase';
import { UpdateCategoryProductUseCase } from '../application/usescases/update-category-product.usecase';
@Public()
@ApiTags('Catégories') // Groupe Swagger
@Controller('categories')
export class CategoryProductController {
  constructor(
    private readonly createCategoryProductUseCase: CreateCategoryProductUseCase,
    private readonly findCategoryProductByIdUseCase: FindCategoryProductByIdUseCase,
    private readonly filterCategoryProductUseCase: FilterCategoryProductUseCase,
    private readonly paginateCategoryProductUseCase: PaginateCategoryProductUseCase,
    private readonly deleteCategoryProductUseCase: DeleteCategoryProductUseCase,
    private readonly updateCategoryProductUseCase: UpdateCategoryProductUseCase,
  ) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Créer une nouvelle catégorie' })
  @ApiResponse({
    status: 201,
    description: 'Catégorie créée avec succès',
    type: CategoryProduct,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiBody({ type: CategoryProductDto })
  async create(
    @Body() createDto: CategoryProductDto,
  ): Promise<CategoryProduct> {
    return await this.createCategoryProductUseCase.execute(createDto);
  }
  @Get('filter/:tenantId')
  @ApiOperation({ summary: 'Filtrer les catégories avec pagination' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Nom partiel ou complet de la catégorie à filtrer',
    example: 'Boisson',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre d’éléments par page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de la page à récupérer',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des catégories filtrées',
    type: [CategoryProduct],
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async filter(
    @Param('tenantId') tenantId: string,
    @Query() dto: CategoryProductDto,
    @Query() paginate: PaginateDto,
  ) {
    return this.filterCategoryProductUseCase.execute(
      tenantId,
      dto,
      paginate.limit,
      paginate.page,
    );
  }
  @Get('paginate/:tenantId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Lister les catégories avec pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre d’éléments par page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de la page à récupérer',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des catégories',
    type: [CategoryProduct],
  })
  async pagination(
    @Param('tenantId') tenantId: string,
    @Query() paginate: PaginateDto,
  ) {
    return await this.paginateCategoryProductUseCase.execute(
      tenantId,
      paginate.limit,
      paginate.page,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une catégorie par ID' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant unique de la catégorie',
    example: 'd3f3a7b2-6e59-4e7c-9b9e-123456789abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Catégorie trouvée',
    type: CategoryProduct,
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide ou ID incorrect',
  })
  @ApiResponse({
    status: 404,
    description: 'Catégorie non trouvée',
  })
  async findById(@Param('id') id: string): Promise<CategoryProduct | null> {
    try {
      return await this.findCategoryProductByIdUseCase.execute(id);
    } catch (error) {
      throw new BadRequestException(
        'Échec lors de la récupération de la catégorie',
        {
          cause: error,
          description: error.message,
        },
      );
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une catégorie par ID' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant unique de la catégorie à supprimer',
    example: 'f3e9a3c2-2bc1-4d55-93d3-58c3b1d4387d',
  })
  @ApiResponse({
    status: 200,
    description: 'Catégorie supprimée avec succès (true ou false)',
    type: Boolean,
  })
  @ApiResponse({
    status: 404,
    description: 'Catégorie non trouvée',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.deleteCategoryProductUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une catégorie par ID' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant unique de la catégorie à mettre à jour',
    example: 'b2f1e9d3-9133-4b49-8103-12f3c2d2a4e7',
  })
  @ApiBody({
    description: 'Données de mise à jour de la catégorie',
    type: CategoryProductDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Catégorie mise à jour avec succès',
    type: CategoryProduct,
  })
  @ApiResponse({
    status: 404,
    description: 'Catégorie non trouvée',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide ou données incorrectes',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: CategoryProductDto,
  ): Promise<CategoryProduct> {
    return await this.updateCategoryProductUseCase.execute(id, updateDto);
  }
}
