import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateTenantUseCase } from '../application/usecases/create-tenant.usecase';
import { CreateTenantDto } from '../application/dtos/create-tenant.dto';
import { Tenant } from '../domain/entities/tenant.entity';
import { SuccessResponse } from 'src/common/types/response-controller.type';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { Public } from 'src/common/decorators/public.decorator';
import { FindByIdTenantUseCase } from '../application/usecases/find-by-Id.usecase';
import { DeleteTenantUseCase } from '../application/usecases/delete-tenant.usecase';
import { UpdateTenantUseCase } from '../application/usecases/update-tenant.usecase';
import { UpdateTenantDto } from '../application/dtos/update-tenant';
import { FindAllTenantUseCase } from '../application/usecases/findAll-tenant.usecase';
import { CreateEspaceTenantUseCase } from '../application/usecases/createEspace-tenant.usecase';
import { UserDto } from 'src/auth/users/application/dtos/user.dto';
import { CreateTenantDtoSpace } from '../application/dtos/create-space.dto';
@Public()
@Controller('tenant')
@ApiTags('Tenant')
export class TenantController {
  constructor(
    private readonly createTenantUseCase: CreateTenantUseCase,
    private readonly findByIdTenantUseCase: FindByIdTenantUseCase,
    private readonly deleteTenantUseCase: DeleteTenantUseCase,
    private readonly updateTenantUseCase: UpdateTenantUseCase,
    private readonly findAllTenantUseCase: FindAllTenantUseCase,
    private readonly createEspaceTenantUseCase: CreateEspaceTenantUseCase,
  ) {}
  @Post()
  @ApiOperation({ summary: 'Créer un nouveau tenant (organisation)' })
  @ApiBody({ type: CreateTenantDto })
  @ApiResponse({
    status: 201,
    description: 'Tenant créé avec succès',
    type: Tenant,
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide (données manquantes ou incorrectes)',
  })
  async create(
    @Body() createDto: CreateTenantDto,
  ): Promise<SuccessResponse<Tenant>> {
    const tenant = await this.createTenantUseCase.execute(createDto);
    const response = ResponseHelper.success(tenant, 'Tenant create success');
    return response;
  }
  @Get(':id')
  @ApiOperation({ summary: 'Récuperer un tenant par son ID' })
  async findById(@Param('id') id: string): Promise<SuccessResponse<Tenant>> {
    const tenant = await this.findByIdTenantUseCase.execute(id);
    const response = ResponseHelper.success(tenant);
    return response;
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un tenant par son ID' })
  async delete(@Param('id') id: string) {
    return await this.deleteTenantUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un tenant existant' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant unique du tenant',
    example: 'd4a1f2b6-8d7e-4c5f-9b1f-123456789abc',
  })
  @ApiBody({ type: UpdateTenantDto })
  @ApiResponse({
    status: 200,
    description: 'Tenant mis à jour avec succès',
    type: Tenant,
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTenantDto,
  ): Promise<SuccessResponse<Tenant>> {
    const tenant = await this.updateTenantUseCase.execute(id, body);
    return ResponseHelper.success(tenant);
  }
  @Get()
  @ApiOperation({ summary: 'Récuperer tous les tenants' })
  async findAll(): Promise<SuccessResponse<Tenant[]>> {
    const res = await this.findAllTenantUseCase.execute();
    return ResponseHelper.success(res);
  }
  @Post('space')
  @ApiOperation({
    summary: 'Créer un espace Tenant',
    description: 'Crée un espace tenant ainsi qu’un utilisateur associé',
  })
  @ApiBody({
    type: CreateTenantDtoSpace,
    description: 'Les informations de l’utilisateur qui sera créé',
  })
  @ApiResponse({
    status: 201,
    description: 'Tenant créé avec succès',
    type: Tenant, // tu peux aussi mettre SuccessResponse<Tenant> si tu l’as défini en DTO Swagger
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la création du tenant',
  })
  async createSpace(
    @Body() user: CreateTenantDtoSpace,
  ): Promise<SuccessResponse<Tenant>> {
    const tenantResp = await this.createEspaceTenantUseCase.execute(
      user.user,
      user.name,
    );
    return ResponseHelper.success(tenantResp);
  }
}
