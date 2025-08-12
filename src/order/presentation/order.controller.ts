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
  Search,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../application/usecases/create-order-usecase.use-case';
import { OrderDto } from '../application/dtos/create-order-dto.dto';
import { OrderEntity } from '../domain/entities/order.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { DeleteOderUseCase } from '../application/usecases/delete-order-usecase.usecase';
import { FindOrderByIdUseCase } from '../application/usecases/find-order-byId-usecase.usecase';
import { PaginateOrderUseCase } from '../application/usecases/pagination-order.usecase';
import { PaginateDto } from '../application/dtos/paginate-order.dto';
import { CanceledOrderUseCase } from '../application/usecases/canceled-order.usecase';
import { ValidateOrderUseCase } from '../application/usecases/validate-order.usecase';
@Public()
@ApiTags('Orders') // Nom de la catégorie dans Swagger
@Controller('order')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly deleteOderUseCase: DeleteOderUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly paginateOrderUseCase: PaginateOrderUseCase,
    private readonly canceledOrderUseCase: CanceledOrderUseCase,
    private readonly validateOrderUseCase: ValidateOrderUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une commande' }) // Description de l'opération
  @ApiResponse({
    status: 201,
    description: 'Commande créée avec succès',
    type: OrderEntity,
  })
  @ApiBadRequestResponse({ description: 'Requête invalide' }) // Gestion des erreurs 400
  @ApiBody({ type: OrderDto }) // Documentation du body de la requête
  async createOrder(@Body() data: OrderDto): Promise<OrderEntity> {
    try {
      return await this.createOrderUseCase.execute(data);
    } catch (error) {
      throw new BadRequestException(`error to controller: ${error.message}`);
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete order By Id' })
  async deleteOrder(@Param('id') orderId: string): Promise<Object> {
    await this.deleteOderUseCase.execute(orderId);
    return { mess: 'order is delete with succefully!' };
  }

  @Get('paginate/:tenantId')
  @ApiOperation({ summary: 'Paginer la liste des produits' })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Retourne une liste paginée de produits',
    schema: {
      example: {
        data: [
          {
            id: 'e49678f3-83cd-4b9a-a25c-c8f30b921392',
            name: 'Coca-Cola',
            description: 'Boisson gazeuse rafraîchissante',
            price: 10,
            criticalStockThreshold: 5000,
            purchasePrice: 400,
            stock: 100,
            supplierId: '...',
            categoryProductId: '...',
            createdAt: '2025-06-24T16:27:16.893Z',
            updatedAt: '2025-06-24T16:27:16.893Z',
          },
        ],
        total: 12,
        totalPage: 2,
        page: 1,
        limit: 10,
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async paginate(
    @Param('tenantId') tenantId: string,
    @Query() query: PaginateDto,
  ) {
    return await this.paginateOrderUseCase.execute(
      tenantId,
      query.page,
      query.limit,
      query.search,
      query.status,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'get order by Id' })
  async findOrderById(@Param('id') orderId: string): Promise<OrderEntity> {
    try {
      // console.log('id controller:', orderId);
      return this.findOrderByIdUseCase.execute(orderId);
    } catch (error) {
      throw new BadRequestException(`error controller: ${error.message}`);
    }
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Annuler une commande' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID de la commande à annuler',
    example: 'b51c6b4f-eeb5-4b12-9c98-2e1a8c5e23cf',
  })
  @ApiResponse({
    status: 200,
    description: 'Commande annulée avec succès',
    type: OrderEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Commande non trouvée',
  })
  async canceled(@Param('id') id: string): Promise<OrderEntity> {
    return await this.canceledOrderUseCase.execute(id);
  }
  @Patch('/completed/:id')
  @ApiOperation({
    summary: 'Valider une commande (passer au statut COMPLETED)',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID de la commande à valider',
    example: '7a6b6d41-d93b-4db7-88c9-55712c7c7a1f',
  })
  @ApiResponse({
    status: 200,
    description: 'Commande validée avec succès',
    type: OrderEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Commande non trouvée',
  })
  @ApiResponse({
    status: 409,
    description: 'La commande ne peut pas être validée dans son état actuel',
  })
  async validate(@Param('id') id: string): Promise<OrderEntity> {
    return await this.validateOrderUseCase.execute(id);
  }
}
