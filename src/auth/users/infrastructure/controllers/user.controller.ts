import {
  Controller,
  Delete,
  Get,
  Param,
  Request,
  UseGuards,
  NotFoundException,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiQuery,
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

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Public()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly paginateUserUseCase: PaginateUserUseCase,
    private readonly filterUserUseCase: FilterUserUseCase,
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
  @Get(':id')
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
}
