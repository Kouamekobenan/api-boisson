import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  DashbordRepositoryName,
  IDashbordRepository,
} from 'src/dashbord/domain/interfaces/repository-dashbord.interface';

@Injectable()
export class GetSaleByDayUseCase {
  private readonly logger = new Logger(GetSaleByDayUseCase.name);

  constructor(
    @Inject(DashbordRepositoryName)
    private readonly dashbordRepository: IDashbordRepository,
  ) {}

  async execute(
    tenantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ total: number }> {
    try {
      if (startDate > endDate) {
        throw new ConflictException(
          'La date de début ne peut être supérieure à la date de fin',
        );
      }
      const result = await this.dashbordRepository.getSalesByDay(
        tenantId,
        startDate,
        endDate,
      );
      return { total: result?.total ?? 0 };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // on laisse passer
      }
      this.logger.error(
        `Failed to retrieve total amount for tenant ${tenantId} from ${startDate.toISOString()} to ${endDate.toISOString()}`,
        error.stack,
      );
      throw new BadRequestException('Failed to retrieve total amount', {
        cause: error,
        description: error.message,
      });
    }
  }
}
