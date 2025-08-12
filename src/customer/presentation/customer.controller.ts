import {
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
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateCustomerUseCase } from '../application/usecases/create-customer.usecase';
import { CreateCustomerDto } from '../application/dtos/create-customer.dto';
import { SuccessResponse } from 'src/common/types/response-controller.type';
import { Customer } from '../domain/entities/customer.entity';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { FindByIdCustomerUseCase } from '../application/usecases/find-by-id.usecase';
import { UpdateCustomerUseCase } from '../application/usecases/update-customer.usecase';
import { UpdateCustomerDto } from '../application/dtos/update-customer.dto';
import { DeleteCustomerUseCase } from '../application/usecases/delete-customer.usecase';
import { PaginateCustomerDto } from '../application/dtos/paginate-customer.dto';
import { PaginationCustomerUseCase } from '../application/usecases/paginate-customer.usecase';
import { FindAllCustomerUseCase } from '../application/usecases/find_all.usecase';

@Controller('customer')
@ApiTags('Customer')
@Public()
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findByIdCustomerUseCase: FindByIdCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly paginateCustomerUseCase: PaginationCustomerUseCase,
    private readonly findAllCustomerUseCase: FindAllCustomerUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau client' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiCreatedResponse({
    description: 'Client créé avec succès',
    type: Customer,
  })
  async create(
    @Body() dto: CreateCustomerDto,
  ): Promise<SuccessResponse<Customer>> {
    const customer = await this.createCustomerUseCase.execute(dto);
    const response = ResponseHelper.success(customer);
    return response;
  }

  @Get('paginate/:tenantId')
  @ApiOperation({ summary: 'Lister les clients avec pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de page (par défaut : 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: "Nombre d'éléments par page (par défaut : 10)",
  })
  @ApiOkResponse({
    description: 'Liste paginée des clients',
    schema: {
      example: {
        statusCode: 200,
        message: 'Success',
        data: [
          {
            id: 'abc123',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+22512345678',
            address: 'Abidjan',
            createdAt: '2025-07-25T12:00:00.000Z',
            updatedAt: '2025-07-25T12:00:00.000Z',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Requête invalide' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async paginate(
    @Param('tenantId') tenantId: string,
    @Query() dto: PaginateCustomerDto,
  ) {
    const { data, total, page, limit } =
      await this.paginateCustomerUseCase.execute(tenantId, dto.limit, dto.page);
    const response = ResponseHelper.paginated(data, total, page, limit);
    return response;
  }
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un client par son ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID du client' })
  @ApiOkResponse({
    description: 'Client trouvé avec succès',
    type: Customer,
  })
  @ApiNotFoundResponse({ description: 'Client non trouvé' })
  async findById(@Param('id') id: string): Promise<SuccessResponse<Customer>> {
    const customer = await this.findByIdCustomerUseCase.execute(id);
    const response = ResponseHelper.success(customer);
    return response;
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un client par son ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID du client à mettre à jour',
    type: String,
  })
  @ApiBody({
    type: UpdateCustomerDto,
    description: 'Les données à mettre à jour pour le client',
  })
  @ApiOkResponse({
    description: 'Client mis à jour avec succès',
    type: Customer,
  })
  @ApiNotFoundResponse({
    description: 'Client non trouvé',
  })
  @ApiBadRequestResponse({
    description: 'Requête invalide',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCustomerDto,
  ): Promise<SuccessResponse<Customer>> {
    const customer = await this.updateCustomerUseCase.execute(id, updateDto);
    const response = ResponseHelper.success(
      customer,
      'Customer updated successfully 🎉',
    );
    return response;
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un client par ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID du client à supprimer',
    type: String,
  })
  @ApiOkResponse({
    description: 'Client supprimé avec succès',
  })
  @ApiNotFoundResponse({
    description: 'Client non trouvé',
  })
  @ApiBadRequestResponse({
    description: 'Requête invalide',
  })
  async deleteCustomer(@Param('id') id: string) {
    return await this.deleteCustomerUseCase.execute(id);
  }
  @Get('tenant/:tenantId')
  @ApiOperation({ summary: 'Récuperer tous les clients' })
  async findAll(@Param('tenantId') tenantId: string): Promise<Customer[]> {
    return await this.findAllCustomerUseCase.execute(tenantId);
  }
}
