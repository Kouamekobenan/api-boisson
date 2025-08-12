import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Tenant } from 'src/tenant/domain/entities/tenant.entity';
import {
  ITenantRepository,
  TenatRepositoryName,
} from 'src/tenant/domain/interfaces/tenant-repository.interface';

@Injectable()
export class FindByIdTenantUseCase {
  private readonly logger = new Logger(FindByIdTenantUseCase.name);
  constructor(
    @Inject(TenatRepositoryName)
    private readonly tenantRepo: ITenantRepository,
  ) {}
  async execute(id: string): Promise<Tenant> {
    try {
      const tenant = await this.tenantRepo.findById(id);
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID: ${id} not found`);
      }
      return tenant;
    } catch (error) {
      this.logger.error('Failled to retrieve tenant', error.stack, '');
      throw new BadRequestException('Failled to retrieve tenant ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
