import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DeliveryPersonUseCase } from '../application/usescases/deliveryPerson-usecase.use-case';
import { DeliveryPersonDto } from '../application/dtos/deliveryPerson-dto.dto';
import { UpdateDeliveryDto } from '../application/dtos/update-dto.deliveryPerson.dto';
import { DeliveryPerson } from '../domain/entities/deliveryPerson';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateDeliveryUseCase } from '../application/usescases/updateDeliveryPerson-dto.dto';
import { FindAllDeliveryUseCase } from '../application/usescases/findall-usecase.use-case';
import { DeleteDeliveryPersonUseCase } from '../application/usescases/delete-usecase.use-case';
@Public()
@ApiTags('DeliveryPerson') // Indique un groupe d'API pour Swagger (ici, "DeliveryPerson")
@Controller('deliveryPerson')
export class DeliveryPersonController {
  constructor(
    private readonly createdDeliveryPersonUseCase: DeliveryPersonUseCase,
    private readonly updateDeliveryUseCase: UpdateDeliveryUseCase,
    private readonly findAllDeliveryUseCase: FindAllDeliveryUseCase,
    private readonly deleteDeliveryPersonUseCase: DeleteDeliveryPersonUseCase,
  ) {}

  @Post()
  @Roles('ADMIN') // Spécifie que seuls les utilisateurs avec le rôle 'admin' peuvent accéder à cette route
  @UseGuards(RolesGuard) // Applique le guard pour vérifier le rôle
  @ApiOperation({ summary: 'Créer un livreur' }) // Résume l'opération pour Swagger
  @ApiResponse({
    status: 201,
    description: 'Livreur créé avec succès',
    type: DeliveryPerson, // Type de la réponse retournée
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  async createDeliveryPerson(
    @Body() deliveryPersonDto: DeliveryPersonDto,
  ): Promise<DeliveryPerson> {
    return await this.createdDeliveryPersonUseCase.execute(deliveryPersonDto);
  }
  // updateDeliveryPerson
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un livreur' }) // Résumé de l'opération pour Swagger
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID du livreur à mettre à jour',
  })
  @ApiResponse({
    status: 200,
    description: 'Livreur mis à jour avec succès',
    type: DeliveryPerson,
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  @ApiResponse({
    status: 404,
    description: 'Livreur non trouvé',
  })
  async updateDeliveryPerson(
    @Param('id') deliveryPersonId: string,
    @Body() deliveryPersonDto: UpdateDeliveryDto,
  ): Promise<DeliveryPerson> {
    try {
      return await this.updateDeliveryUseCase.execute(
        deliveryPersonId,
        deliveryPersonDto,
      );
    } catch (error) {
      throw error;
    }
  }
  @Get(':tenantId')
  @ApiOperation({ summary: 'Récuperer tous les livreurs' })
  async getAllDeliveryPerson(
    @Param('tenantId') tenantId: string,
  ): Promise<DeliveryPerson[]> {
    return await this.findAllDeliveryUseCase.execute(tenantId);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un livreur' })
  async deleteDeliveryPerson(
    @Param('id') deliveryPersonId: string,
  ): Promise<DeliveryPerson> {
    return await this.deleteDeliveryPersonUseCase.execute(deliveryPersonId);
  }
}
