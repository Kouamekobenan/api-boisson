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
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
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
import { HistoryDeliveryPersonUseCase } from '../application/usecases/history-deliveryPerson.usecases';
import { DeliveryProgressUseCase } from '../application/usecases/delivery-progress.usecase';
import { FindOrderByIdUseCase } from 'src/order/application/usecases/find-order-byId-usecase.usecase';
import { FindDeliveryByIdUseCase } from '../application/usecases/findById-delivery.usecase';
import { DeliveryDayUseCase } from '../application/usecases/today-delivery.usecase';
import { FindByDateRangeDeliveryUseCase } from '../application/usecases/findByDateRange-delivery.usecase';

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
    private readonly historyDeliveryPersonUseCase: HistoryDeliveryPersonUseCase,
    private readonly deliveryProgressUseCase: DeliveryProgressUseCase,
    private readonly findByIdDeliveryUseCe: FindDeliveryByIdUseCase,
    private readonly deliveryDayUseCase: DeliveryDayUseCase,
    private readonly findByDateRangeDeliveryUseCase: FindByDateRangeDeliveryUseCase,
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

  @Get('range/date/:tenantId')
  @ApiOperation({ summary: 'Récupérer les livraisons entre deux dates' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    example: '2025-07-01',
    description: 'Date de début (format ISO : YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    example: '2025-07-22',
    description: 'Date de fin (format ISO : YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des livraisons dans l’intervalle de date',
    type: [Delivery],
  })
  async findDateRange(
    @Param('tenantId') tenantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Delivery[]> {
    return await this.findByDateRangeDeliveryUseCase.execute(
      tenantId,
      startDate,
      endDate,
    );
  }
  @Get('/day/:tenantId')
  @ApiOperation({ summary: 'Récupérer les livraisons journalières' })
  @ApiResponse({
    status: 200,
    description: 'Liste des livraisons du jour',
    type: [Delivery],
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async toDay(@Param('tenantId') tenantId: string): Promise<Delivery[]> {
    return await this.deliveryDayUseCase.excute(tenantId);
  }
  @Get('paginate/:tenantId')
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
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: "Rechercher par l'identifiant de la livraison",
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'VALIDATED', 'COMPLETED', 'CANCELLED', 'ALL'],
    description:
      "Filtrer par statut de la livraison (ou 'ALL' pour ne pas filtrer)",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des livraisons',
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            supplierId: 'uuid',
            status: 'PENDING',
            createdAt: '2025-06-11T12:00:00.000Z',
            updatedAt: '2025-06-11T12:00:00.000Z',
            deliveryPerson: {
              id: 'uuid',
              name: 'Nom livreur',
            },
            deliveryProducts: [
              {
                product: {
                  name: 'Produit A',
                  price: 100,
                },
              },
            ],
          },
        ],
        total: 12,
        totalPage: 6,
        page: 1,
        limit: 2,
      },
    },
  })
  async paginate(
    @Param('tenantId') tenantId: string,
    @Query() query: PaginateDto,
  ) {
    return await this.paginateDeliveryUseCase.execute(
      tenantId,
      query.limit,
      query.page,
      query.search,
      query.status,
    );
  }
  @Get('progress/:tenantId')
  @ApiOperation({ summary: 'Récuperer les livraisons en cours' })
  async process(@Param('tenantId') tenantId: string): Promise<Delivery[]> {
    return await this.deliveryProgressUseCase.execute(tenantId);
  }
  @Get(':deliveryPersonId')
  @ApiOperation({
    summary: "Récupérer l'historique des livraisons d'un livreur",
  })
  @ApiParam({
    name: 'deliveryPersonId',
    description: 'ID du livreur',
    required: true,
    example: 'delivery-person-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des livraisons effectuées par le livreur',
    type: [Delivery],
  })
  @ApiResponse({ status: 404, description: 'Livreur non trouvé' })
  async history(
    @Param('deliveryPersonId') deliveryPersonId: string,
  ): Promise<Delivery[]> {
    return await this.historyDeliveryPersonUseCase.execute(deliveryPersonId);
  }
  @Get('/tenant/:tenantId')
  @ApiOperation({ summary: 'Récupérer toutes les livraisons' })
  @ApiResponse({
    status: 200,
    description: 'Liste des livraisons récupérée avec succès',
    type: [Delivery],
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async findAllDelivery(
    @Param('tenantId') tenantId: string,
  ): Promise<Delivery[]> {
    try {
      return await this.findAllDeliveryUseCase.execute(tenantId);
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

  @Get('/deliverie/:deliveryId')
  @ApiOperation({
    summary: 'Récupérer une livraison par ID avec le totalPrice',
  })
  @ApiParam({
    name: 'deliveryId',
    required: true,
    description: 'ID de la livraison à récupérer',
    type: String,
  })
  @ApiOkResponse({
    description: 'Livraison trouvée avec le totalPrice calculé',
    schema: {
      example: {
        data: {
          id: 'abc123',
          deliveryPerson: {
            id: 'user123',
            name: 'Jean Dupont',
          },
          deliveryProducts: [
            {
              product: {
                name: 'Produit A',
                price: 10,
              },
              quantity: 2,
            },
          ],
          totalPrice: 20,
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Livraison non trouvée' })
  @ApiBadRequestResponse({
    description: 'ID invalide ou erreur lors de la récupération',
  })
  async findById(
    @Param('deliveryId') deliveryId: string,
  ): Promise<{ data: Delivery & { totalPrice: number } }> {
    return await this.findByIdDeliveryUseCe.execute(deliveryId);
  }
}
