import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { GetSammaryUseCase } from '../application/usecases/get-sammary.usecase';
import { DashboardSummary } from '../domain/entities/dashbord.entity';
import { DashbordDto } from '../application/dtos/dashbord.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { GetSaleByDayUseCase } from '../application/usecases/getSalesBy.usecases';
@Public()
@Controller('dashbord')
@ApiTags('Dashbord')
export class DashbordController {
  constructor(
    private readonly getSammaryUseCase: GetSammaryUseCase,
    private readonly getSaleByDayUseCase: GetSaleByDayUseCase,
  ) {}

  @Get(':tenantId')
  @ApiOperation({
    summary: 'Obtenir un résumé des ventes et livraisons',
    description:
      'Retourne un résumé global incluant le total des ventes, livraisons et revenus pour un tenant donné.',
  })
  @ApiParam({
    name: 'tenantId',
    description: 'Identifiant unique du tenant (entreprise)',
    example: 'f836d41e-58fb-4a10-a336-f1aafa45b562',
  })
  @ApiResponse({
    status: 200,
    description: 'Résumé du dashboard récupéré avec succès.',
    type: DashbordDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide ou tenantId incorrect.',
  })
  async sammary(
    @Param('tenantId') tenantId: string,
  ): Promise<DashboardSummary> {
    return await this.getSammaryUseCase.execute(tenantId);
  }

  @Get('day-sale/:tenantId')
  @ApiOperation({
    summary: "Récupérer les ventes d'une journée pour un tenant donné",
  })
  @ApiParam({ name: 'tenantId', description: 'ID du tenant', type: String })
  @ApiQuery({
    name: 'startDate',
    description: 'Date de début (format YYYY-MM-DD)',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Date de fin (format YYYY-MM-DD)',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Ventes récupérées avec succès',
    schema: {
      example: { total: 1500 },
    },
  })
  @ApiResponse({ status: 400, description: 'Paramètres invalides' })
  async getDeliveryDay(
    @Param('tenantId') tenantId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ): Promise<{ total: number }> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.getSaleByDayUseCase.execute(tenantId, start, end);
  }
}
