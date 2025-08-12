import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ITenantRepository,
  TenatRepositoryName,
} from 'src/tenant/domain/interfaces/tenant-repository.interface';
import { UpdateTenantDto } from '../dtos/update-tenant';
import { Tenant } from 'src/tenant/domain/entities/tenant.entity';

@Injectable()
export class UpdateTenantUseCase {
  private readonly logger = new Logger(UpdateTenantUseCase.name);
  constructor(
    @Inject(TenatRepositoryName)
    private readonly tenantRepository: ITenantRepository,
  ) {}
  async execute(id: string, updateDto: UpdateTenantDto): Promise<Tenant> {
    try {
      const tenant = await this.tenantRepository.findById(id);
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID: ${id} not found`);
      }
      return await this.tenantRepository.update(id, updateDto);
    } catch (error) {
      this.logger.error(
        `Failled to update tenant with :${id}, data:${JSON.stringify(updateDto)}, ${error}`,
      );
      throw new BadRequestException('Failled to update tenant ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
