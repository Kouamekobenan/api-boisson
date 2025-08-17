import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DashboardSummary } from 'src/dashbord/domain/entities/dashbord.entity';
import {
  DashbordRepositoryName,
  IDashbordRepository,
} from 'src/dashbord/domain/interfaces/repository-dashbord.interface';
@Injectable()
export class GetSammaryUseCase {
  private readonly logger = new Logger(GetSammaryUseCase.name);
  constructor(
    @Inject(DashbordRepositoryName)
    private readonly dashbordRepository: IDashbordRepository,
  ) {}
  async execute(tenantId: string): Promise<DashboardSummary> {
    try {
      const dashbord = await this.dashbordRepository.sammary(tenantId);
      this.logger.log('data dashbord:', JSON.stringify(dashbord));
      return dashbord;
    } catch (error) {
      throw new BadRequestException('Failled to get dashbord', {
        cause: error,
        description: error.message,
      });
    }
  }
}
