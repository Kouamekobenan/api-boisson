import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateDirecteSaleUseCase } from '../application/usecases/create-directSale.usecase';
import { CreateDirectSaleDto } from '../application/dtos/directSale/create-directSale.dto';
import { DirectSale } from '../domain/entities/directSale.entity';
import { SuccessResponse } from 'src/common/types/response-controller.type';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { Public } from 'src/common/decorators/public.decorator';
import { FindDirecteSaleByIdUseCase } from '../application/usecases/find-byId.usecase';
import { PaginateDirecteSaleUseCase } from '../application/usecases/paginate-directeSale.usecase';
import { PaginateDirecteSaleDto } from '../application/dtos/directSale/paginate.dto';
import { FindAllDirecteSaleUseCase } from '../application/usecases/findAll-directeSale.usecase';
import { DeleteDireteSaleUseCase } from '../application/usecases/delete-directeSale';
import { FindCreditSaleUseCase } from '../application/usecases/CreditSale.usecase';
import { query } from 'express';
@Public()
@Controller('directeSale')
@ApiTags('DirecteSale')
export class DirectSaleController {
  constructor(
    private readonly createDirecteSaleUseCase: CreateDirecteSaleUseCase,
    private readonly findDirecteSaleByIdUseCase: FindDirecteSaleByIdUseCase,
    private readonly paginateDirecteSaleUseCase: PaginateDirecteSaleUseCase,
    private readonly findAllDirecteSaleUseCase: FindAllDirecteSaleUseCase,
    private readonly deleteDireteSaleUseCase: DeleteDireteSaleUseCase,
    private readonly findCreditSaleUseCase: FindCreditSaleUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une vente directe' })
  @ApiBody({ type: CreateDirectSaleDto })
  @ApiResponse({
    status: 201,
    description: 'Vente directe créée avec succès',
    type: DirectSale,
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide ou données manquantes',
  })
  async create(
    @Body() createDto: CreateDirectSaleDto,
  ): Promise<SuccessResponse<DirectSale>> {
    const directeSale = await this.createDirecteSaleUseCase.execute(createDto);
    const response = ResponseHelper.success(directeSale);
    return response;
  }

  @Get('credit')
  @ApiOperation({ summary: 'Pagination des ventes directes à crédit' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de page',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre d’éléments par page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des ventes directes à crédit.',
  })
  async findCreditSale(@Query() query: PaginateDirecteSaleDto) {
    const { data, total, page, limit } =
      await this.findCreditSaleUseCase.execute(query.limit, query.page);
    const response = ResponseHelper.paginated(
      data,
      total,
      page,
      limit,
      'Directe paginate data credit:',
    );
    return response;
  }

  @Get('paginate')
  @ApiOperation({ summary: 'Pagination des ventes directes' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de page',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre d’éléments par page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des ventes directes.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async paginate(@Query() query: PaginateDirecteSaleDto) {
    const limitNumber = Number(query.limit);
    const pageNumber = Number(query.page);
    const { data, total, page, limit } =
      await this.paginateDirecteSaleUseCase.execute(limitNumber, pageNumber);
    const response = ResponseHelper.paginated(
      data,
      total,
      page,
      limit,
      'Directe paginate data:',
    );
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une vente directe par ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Identifiant unique de la vente directe',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Vente directe récupérée avec succès',
    type: DirectSale,
  })
  @ApiResponse({
    status: 404,
    description: 'Vente directe non trouvée',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<SuccessResponse<DirectSale>> {
    const directSale = await this.findDirecteSaleByIdUseCase.execute(id);
    const response = ResponseHelper.success(directSale, 'Vente directe data:');
    return response;
  }
  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les ventes directes' })
  @ApiOkResponse({
    description: 'Liste des ventes directes récupérées avec succès',
    type: DirectSale, // ou crée un DTO `SuccessDirectSaleResponseDto` pour Swagger
  })
  async findAll(): Promise<SuccessResponse<DirectSale[]>> {
    try {
      const directeSales = await this.findAllDirecteSaleUseCase.execute();
      return ResponseHelper.success(directeSales, 'Directe sales data:');
    } catch (error) {
      throw new Error('Échec lors de la récupération des ventes directes');
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une vente directe par ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID de la vente directe à supprimer',
  })
  @ApiResponse({
    status: 200,
    description: 'Vente directe supprimée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Vente directe non trouvée',
  })
  @ApiResponse({
    status: 400,
    description: 'ID invalide ou erreur lors de la suppression',
  })
  async delete(@Param('id') id: string) {
    return await this.deleteDireteSaleUseCase.execute(id);
  }
}
