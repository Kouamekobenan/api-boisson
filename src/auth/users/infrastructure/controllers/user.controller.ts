import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
  Post,
  Body,
  Req,
  HttpStatus,
  HttpException,
  Put,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { User } from '../../domain/entities/user.entity';
import { FindAllUserUseCase } from '../../application/usecases/findAlluser.user.use-case';
import { DeleteUserUseCase } from '../../application/usecases/delete.user.use-case';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindUserByIdUseCase } from '../../application/usecases/find_user_by_id.use_case';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { PaginateDto } from '../../application/dtos/paginate-user.dto';
import { PaginateUserUseCase } from '../../application/usecases/paginate-user.usecase';
import { FilterUserUseCase } from '../../application/usecases/filter-user.usecase';
import { FilterUserDto } from '../../application/dtos/filter-user.dto';
import { UserRole } from '../../domain/enums/role.enum';
import { PaginateUserQueryDto } from '../../application/dtos/paginateUserQuery.dto';
import { AddNotificationUseCase } from '../../application/usecases/notifications-user.usecase';
import { PushSubscriptionDto } from '../../application/dtos/subscrption.dto';
import { FindManagerByTenantUseCase } from '../../application/usecases/find-managerby-tenant.usecase';
import { CurrentUser } from 'src/common/curent-user.decorator';
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
// @Public()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly paginateUserUseCase: PaginateUserUseCase,
    private readonly filterUserUseCase: FilterUserUseCase,
    private readonly addNotificationUseCase: AddNotificationUseCase,
    private readonly findManagerByTenantUseCase: FindManagerByTenantUseCase,
  ) {}

  @Public()
  @Get(':tenantId')
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiOkResponse({
    description: 'Liste des utilisateurs récupérée avec succès',
    type: [User],
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async getAllUsers(@Param('tenantId') tenantId: string): Promise<User[]> {
    return await this.findAllUserUseCase.execute(tenantId);
  }
  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateurs' })
  async deleteUser(@Param('id') userId: string): Promise<boolean> {
    try {
      this.deleteUserUseCase.execute(userId);
      return true;
    } catch {
      console.error;
      return false;
    }
  }
  @Get('filter/:tenantId')
  @ApiOperation({ summary: 'Filtrer les utilisateurs' })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: "Adresse email de l'utilisateur",
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: "Nom de l'utilisateur",
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    type: String,
    description: "Numéro de téléphone de l'utilisateur",
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de page pour la pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: "Nombre d'éléments par page",
    example: 10,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async filter(
    @Param('tenantId') tenantId: string,
    @Query() filters: FilterUserDto,
    @Query() paginate: PaginateDto,
  ) {
    return await this.filterUserUseCase.execute(
      tenantId,
      filters,
      paginate.limit,
      paginate.page,
    );
  }
  @Get('paginate/:tenantId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Paginer les utilisateurs avec des recherches multi-critères',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: "Nom de l'utilisateur",
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: "Adresse email de l'utilisateur",
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    type: String,
    description: "Numéro de téléphone de l'utilisateur",
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de la page (par défaut: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: "Nombre d'éléments par page (par défaut: 2)",
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
    description: 'Rôle de l’utilisateur',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des utilisateurs',
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'MANAGER',
          },
        ],
        total: 12,
        totalPage: 6,
        page: 1,
        limit: 2,
      },
    },
  })
  async paginate(
    @Param('tenantId') tenantId: string,
    @Query() query: PaginateUserQueryDto,
  ) {
    const { page = '1', limit = '2', role, ...search } = query;
    return await this.paginateUserUseCase.execute(
      tenantId,
      Number(page),
      Number(limit),
      search,
      role,
    );
  }
  @Public()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('tenant/:id')
  @ApiOperation({
    summary: 'Récupérer le user par son ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur récupéré avec succès',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async getUserById(@Param('id') userId: string): Promise<User> {
    console.log('User ID:', userId);
    const user = await this.findUserByIdUseCase.execute(userId);
    return user;
  }

  @Patch('push-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Mettre à jour la souscription push d’un utilisateur',
    description:
      'Permet d’enregistrer ou mettre à jour la souscription Web Push (Push API) pour envoyer des notifications push à un utilisateur.',
  })
  @ApiBody({
    description: 'Données de souscription push envoyées par le navigateur',
    type: PushSubscriptionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Souscription push enregistrée avec succès',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async updatePushSubscription(
    @Req() query: any,
    @Body() subscription: PushSubscriptionDto,
  ): Promise<User | null> {
    const userId = query.user.userId;
    console.log('userID', userId);
    return this.addNotificationUseCase.execute(userId, subscription);
  }
  @Get('/subscription/:tenantId')
  @ApiOperation({
    summary: 'Trouver le manager associé à un tenant',
    description:
      "Cet endpoint permet de récupérer le manager associé à un tenant précis, notamment pour associer la souscription push à l'administrateur responsable.",
  })
  @ApiParam({
    name: 'tenantId',
    type: String,
    description: 'ID du tenant',
    example: 'a1b2c3d4-9876-4422-bbbb-123456789000',
  })
  @ApiResponse({
    status: 200,
    description: 'Manager trouvé avec succès',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Aucun manager trouvé pour ce tenant',
  })
  async findManagerByTenant(
    @Param('tenantId') tenantId: string,
  ): Promise<User | null> {
    return this.findManagerByTenantUseCase.execute(tenantId);
  }

  @Public() // ✅ Correct: Cette route peut être publique
  @Get('push/public-key')
  @ApiOperation({
    summary: 'Récupérer la clé publique VAPID pour les notifications push',
  })
  @ApiResponse({
    status: 200,
    description: 'Clé publique VAPID',
    schema: {
      example: {
        publicKey: 'BM...',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Clé publique non configurée',
  })
  getPublicKey(): { publicKey: string } {
    const publicKey = process.env.VAPID_PUBLIC_KEY;

    if (!publicKey) {
      throw new HttpException(
        'VAPID_PUBLIC_KEY is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { publicKey };
  }
}
