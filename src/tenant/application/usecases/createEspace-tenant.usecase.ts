import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { UserDto } from 'src/auth/users/application/dtos/user.dto';
import { IUserRepository } from 'src/auth/users/application/interfaces/user.interface.repository';
import { Tenant } from 'src/tenant/domain/entities/tenant.entity';
import {
  ITenantRepository,
  TenatRepositoryName,
} from 'src/tenant/domain/interfaces/tenant-repository.interface';

@Injectable()
export class CreateEspaceTenantUseCase {
  private readonly logger = new Logger(CreateEspaceTenantUseCase.name);
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject(TenatRepositoryName)
    private readonly tenantRepo: ITenantRepository,
    private readonly authService: AuthService,
  ) {}
  async execute(userDto: UserDto, name: string){
    try {
      const hashpasword = await this.authService.hashPassword(userDto.password);
      const tenant = await this.tenantRepo.createEspace(
        { ...userDto, password: hashpasword },
        name,
      );
      return tenant;
    } catch (error) {
      this.logger.error('Failled to create espace tenant and user', error);
      throw new BadRequestException('Failled to create tenant and user', {
        cause: error,
        description: error.message,
      });
    }
  }
}
