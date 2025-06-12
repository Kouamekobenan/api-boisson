import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { DeleteOderUseCase } from '../application/usecases/delete-order-usecase.usecase';
import { FindOrderByIdUseCase } from '../application/usecases/find-order-byId-usecase.usecase';
@Public()
@ApiTags('Orders') // Nom de la catégorie dans Swagger
@Controller('order')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly deleteOderUseCase: DeleteOderUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
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
