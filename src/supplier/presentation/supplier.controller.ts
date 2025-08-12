import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateSupplierUseCase } from '../application/usescases/create-usecase.supplier-usecase';
import { SupplierDto } from '../application/dtos/supplier-dto.dto';
import { SupplierEntity } from '../domain/entities/supplier.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { FindAllSupplierUseCase } from '../application/usescases/find-all-suppliers.use-case';
import { SupplierUpdateUseCase } from '../application/usescases/updte-supplier.use-case';
import { UpdateSupplierDto } from '../application/dtos/update-dto.dto';
import { DeleteSupplierUseCase } from '../application/usescases/delete-supplier.use-case';
import { FindByIdSupplierUseCase } from '../application/usescases/find-supplier-byId.usecase';

@Public()
@ApiTags('Supplier') // Catégorie dans Swagger
@Controller('supplier')
export class SupplierController {
  constructor(
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly findAllSupplierUseCase: FindAllSupplierUseCase,
    private readonly supplierUpdateUseCase: SupplierUpdateUseCase,
    private readonly deleteSupplierUseCase: DeleteSupplierUseCase,
    private readonly findByIdSupplierUseCase: FindByIdSupplierUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un fournisseur',
    description: 'Ajoute un nouveau fournisseur dans la base de données.',
  })
  @ApiResponse({
    status: 201,
    description: 'Fournisseur créé avec succès.',
    type: SupplierEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation des données.',
  })
  @ApiBody({ type: SupplierDto, description: 'Données du fournisseur à créer' })
  async create(@Body() data: SupplierDto) {
    try {
      return await this.createSupplierUseCase.execute(data);
    } catch (error) {
      throw new BadRequestException(
        `Erreur dans le contrôleur: ${error.message}`,
      );
    }
  }
  @Get(':tenantId')
  @ApiOperation({
    summary: 'Récupérer tous les fournisseurs',
    description: 'Retourne la liste de tous les fournisseurs enregistrés',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des fournisseurs récupérée avec succès',
    type: [SupplierEntity],
  })
  async findAll(
    @Param('tenantId') tenantId: string,
  ): Promise<SupplierEntity[]> {
    return await this.findAllSupplierUseCase.execute(tenantId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Mettre à jour un fournisseur',
    description: "Met à jour les informations d'un fournisseur existant",
  })
  @ApiParam({
    name: 'id',
    description: "L'ID du fournisseur à mettre à jour",
    type: String,
  })
  @ApiBody({
    type: UpdateSupplierDto,
    description: 'Les nouvelles données du fournisseur',
  })
  @ApiResponse({
    status: 200,
    description: 'Fournisseur mis à jour avec succès',
    type: SupplierEntity,
  })
  @ApiResponse({ status: 404, description: 'Fournisseur non trouvé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async update(
    @Param('id') supplierId: string,
    @Body() data: UpdateSupplierDto,
  ): Promise<SupplierEntity> {
    return await this.supplierUpdateUseCase.execute(supplierId, data);
  }
  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer un fournisseur',
    description: 'Supprime un fournisseur en fonction de son ID',
  })
  @ApiParam({
    name: 'id',
    description: "L'ID du fournisseur à supprimer",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Fournisseur supprimé avec succès',
    type: Boolean,
  })
  @ApiResponse({ status: 404, description: 'Fournisseur non trouvé' })
  async deleted(@Param('id') supplierId: string): Promise<boolean> {
    await this.deleteSupplierUseCase.execute(supplierId);
    return true;
  }
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un fournisseur par ID' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant unique du fournisseur',
    type: String,
    example: 'a3f84c3d-7e25-4c2b-b97f-1df22f8f3a10',
  })
  @ApiResponse({
    status: 200,
    description: 'Fournisseur trouvé avec succès',
    type: SupplierEntity,
  })
  @ApiResponse({ status: 404, description: 'Fournisseur non trouvé' })
  async findById(@Param('id') id: string): Promise<SupplierEntity> {
    return await this.findByIdSupplierUseCase.execute(id);
  }
}
