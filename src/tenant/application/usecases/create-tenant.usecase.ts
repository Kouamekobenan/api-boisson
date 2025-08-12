import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  ITenantRepository,
  TenatRepositoryName,
} from 'src/tenant/domain/interfaces/tenant-repository.interface';
import { CreateTenantDto } from '../dtos/create-tenant.dto';
import { Tenant } from 'src/tenant/domain/entities/tenant.entity';

@Injectable()
export class CreateTenantUseCase {
  private readonly logger = new Logger(CreateTenantUseCase.name);
  constructor(
    @Inject(TenatRepositoryName)
    private readonly tenantRepository: ITenantRepository,
  ) {}
  async execute(createDto: CreateTenantDto): Promise<Tenant> {
    try {
      return await this.tenantRepository.create(createDto);
    } catch (error) {
      this.logger.error('Failled to create tenant ', error.stack);
      throw new BadRequestException('Failled to create tenant', {
        cause: error,
        description: error.message,
      });
    }
  }
}
