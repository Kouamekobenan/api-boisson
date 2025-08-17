import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Tenant } from 'src/tenant/domain/entities/tenant.entity';
import {
  ITenantRepository,
  TenatRepositoryName,
} from 'src/tenant/domain/interfaces/tenant-repository.interface';

@Injectable()
export class FindAllTenantUseCase {
  private readonly logger = new Logger(FindAllTenantUseCase.name);
  constructor(
    @Inject(TenatRepositoryName)
    private readonly tenantRepository: ITenantRepository,
  ) {}
  async execute(): Promise<Tenant[]> {
    try {
      return await this.tenantRepository.findAll();
    } catch (error) {
      this.logger.error('Failled to retrieve tenants', error.stack);
      throw new BadRequestException('Failled to retrieve tenants', {
        cause: error,
        description: error.message,
      });
    }
  }
}
