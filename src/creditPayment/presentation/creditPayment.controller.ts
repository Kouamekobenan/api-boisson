import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
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
import { CreateCreditPaymentUseCase } from '../application/usecases/create-creditPayment.usecase';
import { CreateCreditPaymentDto } from '../application/dtos/create-creditPayment.dto';
import {
  PaginatedResponse,
  SuccessResponse,
} from 'src/common/types/response-controller.type';
import { CreditPayment } from '../domain/entities/creditPayment.entity';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { Public } from 'src/common/decorators/public.decorator';
import { FindByIdCreditPaymentUseCase } from '../application/usecases/find-by-id-creditPayment.usecase';
import { PaginateCreditPaymentUseCase } from '../application/usecases/paginate-creditPayment.usecase';
import { PaginateCustomerDto } from 'src/customer/application/dtos/paginate-customer.dto';
import { DeleteCreditPaymentUseCase } from '../application/usecases/delete-creditPayment.usecase';
import { UpdateCreditPaymentUseCase } from '../application/usecases/update-creditPayment.usecase';
import { UpdateCreditPaymentDto } from '../application/dtos/update-creditPayment';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/auth/users/domain/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Public()
@Controller('creditPayment')
@ApiTags('CreditPayment')
export class CreaditPaymentController {
  constructor(
    private readonly creditPaymentUseCase: CreateCreditPaymentUseCase,
    private readonly findByIdCreditPaymentUseCase: FindByIdCreditPaymentUseCase,
    private readonly paginateCreditPaymentUseCase: PaginateCreditPaymentUseCase,
    private readonly deleteCreditPaymentUseCase: DeleteCreditPaymentUseCase,
    private readonly updateCreditPaymentUseCase: UpdateCreditPaymentUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un paiement à crédit' })
  @ApiBody({ type: CreateCreditPaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Paiement à crédit créé avec succès',
    type: CreditPayment,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async create(
    @Body() dto: CreateCreditPaymentDto,
  ): Promise<SuccessResponse<CreditPayment>> {
    const creditPayment = await this.creditPaymentUseCase.execute(dto);
    const response = ResponseHelper.success(
      creditPayment,
      'Dueamount paid with succesfully:',
    );
    return response;
  }
  @Get('paginate')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Récupérer les paiements de crédit paginés' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Numéro de la page',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: "Nombre d'éléments par page",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des paiements de crédit',
    type: CreditPayment, // ou une classe enveloppée si tu as une réponse typée
    isArray: true,
  })
  async paginate(
    @Query() query: PaginateCustomerDto,
  ): Promise<PaginatedResponse<CreditPayment>> {
    const { data, total, page, limit } =
      await this.paginateCreditPaymentUseCase.execute(query.limit, query.page);

    const response = ResponseHelper.paginated(
      data,
      total,
      page,
      limit,
      'Data creditPayment :',
    );
    return response;
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un paiement de crédit par ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Identifiant du paiement de crédit',
  })
  @ApiResponse({
    status: 200,
    description: 'Paiement de crédit trouvé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun paiement de crédit trouvé avec cet ID',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<SuccessResponse<CreditPayment>> {
    const creditPayment = await this.findByIdCreditPaymentUseCase.execute(id);
    const response = ResponseHelper.success(creditPayment);
    return response;
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un paiement de crédit par ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Identifiant du paiement de crédit à supprimer',
  })
  @ApiResponse({
    status: 200,
    description: 'Paiement de crédit supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Paiement de crédit non trouvé',
  })
  async delete(@Param('id') id: string) {
    return await this.deleteCreditPaymentUseCase.execute(id);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Mettre à jour un paiement de crédit' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Identifiant du paiement de crédit à mettre à jour',
  })
  @ApiBody({
    type: UpdateCreditPaymentDto,
    description: 'Données pour mettre à jour le paiement de crédit',
  })
  @ApiResponse({
    status: 200,
    description: 'Paiement de crédit mis à jour avec succès',
    type: CreditPayment,
  })
  @ApiResponse({
    status: 404,
    description: 'Paiement de crédit non trouvé',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCreditPaymentDto,
  ): Promise<SuccessResponse<CreditPayment>> {
    const creditPayment = await this.updateCreditPaymentUseCase.execute(
      id,
      dto,
    );
    const response = ResponseHelper.success(
      creditPayment,
      'Data creditPayment to update:',
    );
    return response;
  }
}
