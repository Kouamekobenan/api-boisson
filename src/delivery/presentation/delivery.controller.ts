import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeliveryDto } from '../application/dtos/delivery-dto.dto';
import { Delivery } from '../domain/entities/delivery.entity';
import { CreateDeliveryUseCase } from '../application/usecases/delivery-usecase.use-case';
import { Public } from 'src/common/decorators/public.decorator';
import { FindAllDeliveryUseCase } from '../application/usecases/findAll-delivery.use-case';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateDeliveryDto } from '../application/dtos/update-delivery-dto.dto';
import { UpdateDeliveryUseCase } from '../application/usecases/update-dto.dto';
import { DeleteDeliveryUseCase } from '../application/usecases/delete-usecase.use-case';
import { FindAllDeliveryOfDeliveryPersonUsecase } from '../application/usecases/find-all-delivery-of.deliveryPerson.usecase';
import { ValidateDeliveryUseCase } from '../application/usecases/validate-delivery.usecase';
import { CanceledDeliveryUseCase } from '../application/usecases/cancel-delivery.usecase';
import { PaginateDeliveryUseCase } from '../application/usecases/paginate-delivery.usecase';
import { PaginateDto } from '../application/dtos/paginate.dto';


@ApiTags('Delivery')
@Controller('delivery')
@Public()
export class DeliveryController {
  constructor(
    private readonly createDeliveryUseCase: CreateDeliveryUseCase,
    private readonly findAllDeliveryUseCase: FindAllDeliveryUseCase,
    private readonly udpdateDeliveryUseCase: UpdateDeliveryUseCase,
    private readonly deleteDeliveryUseCase: DeleteDeliveryUseCase,
    private readonly findAllDeliveryOfDeliveryPersonUsecase: FindAllDeliveryOfDeliveryPersonUsecase,
    private readonly validateDeliveryUseCase: ValidateDeliveryUseCase,
    private readonly canceledDeliveryUseCase: CanceledDeliveryUseCase,
    private readonly paginateDeliveryUseCase: PaginateDeliveryUseCase,
  ) {}

  @Post(':id')
  @ApiOperation({ summary: 'Créer une nouvelle livraison' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant de la livraison',
  })
  @ApiBody({
    type: DeliveryDto,
    description: 'Données de la livraison à créer',
  })
  @ApiResponse({
    status: 201,
    description: 'Livraison créée avec succès',
    type: Delivery,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async created(
    @Param('id') deliveryId: string,
    @Body() delivery: DeliveryDto,
  ): Promise<Delivery> {
    return await this.createDeliveryUseCase.execute(deliveryId, delivery);
  }

  @Get('paginate')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Paginer les livraisons' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de la page (par défaut: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: "Nombre d'éléments par page (par défaut: 2)",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des livraisons',
    schema: {
      example: {
        data: [
          {
            id: 1,
            supplierId: 'uuid',
            createdAt: '2025-06-11T12:00:00.000Z',
            updatedAt: '2025-06-11T12:00:00.000Z',
          },
        ],
        total: 12,
        totalPage: 6,
        page: 1,
        limit: 2,
      },
    },
  })
  async paginate(@Query() query: PaginateDto) {
    return await this.paginateDeliveryUseCase.execute(query.limit, query.page);
  }
  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les livraisons' })
  @ApiResponse({
    status: 200,
    description: 'Liste des livraisons récupérée avec succès',
    type: [Delivery],
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async findAllDelivery(): Promise<Delivery[]> {
    try {
      return await this.findAllDeliveryUseCase.execute();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une livraison' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant de la livraison',
  })
  @ApiBody({
    type: UpdateDeliveryDto,
    description: 'Données de mise à jour de la livraison',
  })
  @ApiResponse({
    status: 200,
    description: 'Livraison mise à jour avec succès',
    type: Delivery,
  })
  @ApiResponse({ status: 404, description: 'Livraison non trouvée' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async updateDelivery(
    @Param('id') DeliveryId: string,
    @Body() data: UpdateDeliveryDto,
  ): Promise<Delivery> {
    return await this.udpdateDeliveryUseCase.execute(DeliveryId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une livraison' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant de la livraison',
  })
  @ApiResponse({ status: 200, description: 'Livraison supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Livraison non trouvée' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async deleteDelivery(@Param('id') deliveryId: string): Promise<Boolean> {
    try {
      await this.deleteDeliveryUseCase.execute(deliveryId);
      return true;
    } catch (error) {
      return false;
    }
  }

  @Get(':deliveryPersonId')
  @ApiOperation({
    summary:
      'Récupérer toutes les livraisons d’un livreur dans un intervalle de dates',
  })
  @ApiParam({
    name: 'deliveryPersonId',
    description: 'ID du livreur',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Date de début (format YYYY-MM-DD)',
    example: '2024-10-01',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Date de fin (format YYYY-MM-DD)',
    example: '2024-11-01',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des livraisons trouvées',
    type: [Delivery],
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 404, description: 'Aucune livraison trouvée' })
  async findDetails(
    @Param('deliveryPersonId') deliveryPersonId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Delivery[]> {
    return await this.findAllDeliveryOfDeliveryPersonUsecase.execute(
      deliveryPersonId,
      startDate,
      endDate,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Valider une livraison' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifiant de la livraison',
  })
  @ApiBody({
    type: DeliveryDto,
    description: 'Données de la livraison à valider',
  })
  @ApiResponse({
    status: 200,
    description: 'Livraison validée avec succès',
    type: Delivery,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async validateDeliveryById(
    @Param('id') deliveryPersonId: string,
    @Body() data: DeliveryDto,
  ): Promise<Delivery> {
    try {
      return this.validateDeliveryUseCase.execute(deliveryPersonId, data);
    } catch (error) {
      throw new BadRequestException(
        'Erreur lors de la validation de la livraison',
      );
    }
  }

  @Patch('canceled/:id')
  @ApiOperation({ summary: 'Annuler une livraison en cours' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant de la livraison',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Livraison annulée avec succès',
    type: Delivery,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 404, description: 'Livraison non trouvée' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async annulateDelivery(@Param('id') deliveryId: string): Promise<Delivery> {
    return await this.canceledDeliveryUseCase.execute(deliveryId);
  }
}
