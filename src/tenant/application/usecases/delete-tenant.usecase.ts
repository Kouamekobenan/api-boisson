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
@Injectable()
export class DeleteTenantUseCase {
  private readonly logger = new Logger(DeleteTenantUseCase.name);
  constructor(
    @Inject(TenatRepositoryName)
    private readonly tenantRepository: ITenantRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      const tenant = await this.tenantRepository.findById(id);
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID: ${id} not found `);
      }
      await this.tenantRepository.delete(id);
      return true;
    } catch (error) {
      this.logger.error('Failled to retrieve tenant', error.stack);
      throw new BadRequestException('Failled to retrieve tenant', error);
    }
  }
}
