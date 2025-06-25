import {
  BadRequestException,
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
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { DeleteOderUseCase } from '../application/usecases/delete-order-usecase.usecase';
import { FindOrderByIdUseCase } from '../application/usecases/find-order-byId-usecase.usecase';
import { PaginateOrderUseCase } from '../application/usecases/pagination-order.usecase';
import { PaginateDto } from '../application/dtos/paginate-order.dto';
@Public()
@ApiTags('Orders') // Nom de la catégorie dans Swagger
@Controller('order')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly deleteOderUseCase: DeleteOderUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly paginateOrderUseCase: PaginateOrderUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une commande' }) // Description de l'opération
  @ApiResponse({
    status: 201,
    description: 'Commande créée avec succès',
    type: OrderEntity,
  }) // Réponse réussie
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

  @Get('paginate')
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
  async paginate(@Query() query: PaginateDto) {
    return await this.paginateOrderUseCase.execute(query.page, query.limit);
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
}
