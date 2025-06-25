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
} from '@nestjs/swagger';
import { CreateInvoiceUseCase } from '../application/usescase/create-invoice.dto';
import { CreateInvoiceDto } from '../application/dtos/create-invoice.dto';
import { Invoice } from '../domain/entities/invoice.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { FindInvoiceByIdUseCase } from '../application/usescase/find-invoice-byId.usecase';
import { DeleteInvoiceUseCase } from '../application/usescase/delete-invoice.usecase';
import { GetAllInvoiceUseCase } from '../application/usescase/gell-all-invoice.usecase';
import { PaginateInvoiceUseCase } from '../application/usescase/paginate-invoice';
import { PaginateDto } from '../application/dtos/paginate-invoice.dto';
@Public()
@ApiTags('Invoice') // Groupe Swagger
@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly createInvoiceUsecase: CreateInvoiceUseCase,
    private readonly findInvoiceByIdUseCase: FindInvoiceByIdUseCase,
    private readonly deleteInvoiceUseCase: DeleteInvoiceUseCase,
    private readonly getAllnvoiceUseCase: GetAllInvoiceUseCase,
    private readonly paginateInvoiceUseCase: PaginateInvoiceUseCase,
  ) {}
  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle facture' })
  @ApiResponse({
    status: 201,
    description: 'Facture créée avec succès',
    type: Invoice,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiBody({ type: CreateInvoiceDto })
  async execute(@Body() createDto: CreateInvoiceDto): Promise<Invoice> {
    return await this.createInvoiceUsecase.execute(createDto);
  }
  @Get('paginate')
  @ApiOperation({ summary: 'Paginer la liste des factures' })
  @ApiQuery({ name: 'page', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: true, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des factures',
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            customerName: 'Jean Dupont',
            amount: 5000,
            status: 'payée',
            createdAt: '2025-06-24T15:00:00.000Z',
            updatedAt: '2025-06-24T16:00:00.000Z',
          },
        ],
        total: 35,
        totalPage: 4,
        page: 1,
        limit: 10,
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async paginate(@Query() query: PaginateDto) {
    return await this.paginateInvoiceUseCase.execute(query.page, query.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une facture par ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la facture',
    example: '1f8b5b1e-2f7b-4a0f-9f0e-5d2f6e7c3e87',
  })
  @ApiResponse({
    status: 200,
    description: 'Facture trouvée',
    type: Invoice,
  })
  @ApiResponse({
    status: 404,
    description: 'Facture non trouvée',
  })
  async findById(@Param('id') id: string): Promise<Invoice | null> {
    return await this.findInvoiceByIdUseCase.execute(id);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une facture par ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la facture à supprimer',
    example: '1f8b5b1e-2f7b-4a0f-9f0e-5d2f6e7c3e87',
  })
  @ApiResponse({
    status: 200,
    description: 'Facture supprimée avec succès',
    schema: {
      type: 'boolean',
      example: true,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Facture non trouvée',
  })
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.deleteInvoiceUseCase.execute(id);
  }
  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les factures' })
  @ApiResponse({
    status: 200,
    description: 'Liste des factures',
    type: Invoice,
    isArray: true,
  })
  async findAll(): Promise<Invoice[]> {
    return await this.getAllnvoiceUseCase.execute();
  }
}
