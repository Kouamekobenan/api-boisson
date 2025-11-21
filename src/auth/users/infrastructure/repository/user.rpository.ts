import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  IUserRepository,
  PushSubscriptionType,
} from '../../application/interfaces/user.interface.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserMapper } from '../../domain/mappers/user.mapper';
import { UserDto } from '../../application/dtos/user.dto';
import { User } from '../../domain/entities/user.entity';
import { FilterUserDto } from '../../application/dtos/filter-user.dto';
import { UserRole } from '../../domain/enums/role.enum';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: UserMapper,
  ) {}

  async createUser(dataUser: UserDto): Promise<User> {
    try {
      const createusers = this.mapper.toPersitence(dataUser);
      const users = await this.prisma.user.create({ data: createusers });
      return this.mapper.toAplication(users);
    } catch (error) {
      const logger = new Logger('UserCreation');
      //
      logger.error('Une erreur est survenue', error.stack);
      // console.error
      throw new BadGatewayException('une erreur', error);
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'email ${email} non trouvé`,
      );
    }

    try {
      return this.mapper.toAplication(user);
    } catch (error) {
      console.error('Erreur lors du mapping du User :', error);
      throw new InternalServerErrorException('Erreur interne du serveur');
    }
  }

  async getAllUsers(tenantId: string): Promise<User[]> {
    try {
      const allUsers = await this.prisma.user.findMany({
        where: { tenantId },
        include: {
          tenant: {
            select: { name: true },
          },
        },
      });
      return allUsers.map((user) => this.mapper.toAplication(user));
    } catch (error) {
      throw new BadGatewayException("une erreur s'est produite:", error);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await this.prisma.user.delete({ where: { id: userId } });
      if (!user) {
        throw new Error('user no exist!');
      }
    } catch (error) {
      console.error("une erreur s\'est produite lors de suppression!");
    }
  }
  async getUserById(userId: string): Promise<User> {
    try {
      const users = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          tenant: { select: { name: true } },
        },
      });
      if (!users) {
        throw new NotFoundException(`User :${userId} doesn't exist!`);
      }
      return this.mapper.toAplication(users);
    } catch (error) {
      throw new BadRequestException(`User not found!: ${error.message}`);
    }
  }
  async paginate(
    tenantId: string,
    page: number,
    limit: number,
    search: FilterUserDto,
    role?: UserRole | 'ALL',
  ): Promise<{
    data: User[];
    totalPage: number;
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const where: any = { tenantId };
      const orFilters: any[] = [];

      if (search?.name?.trim()) {
        orFilters.push({
          name: { contains: search.name.trim(), mode: 'insensitive' },
        });
      }
      if (search?.email?.trim()) {
        orFilters.push({
          email: { contains: search.email.trim(), mode: 'insensitive' },
        });
      }
      if (search?.phone?.trim()) {
        orFilters.push({
          phone: { contains: search.phone.trim(), mode: 'insensitive' },
        });
      }

      if (orFilters.length > 0) {
        where.OR = orFilters;
      }

      if (role && role !== 'ALL') {
        where.role = role;
      }

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        data: users.map((user) => this.mapper.toAplication(user)),
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failed to paginate users', error.stack);
      throw new BadRequestException('Failed to paginate users', {
        cause: error,
        description: error.message,
      });
    }
  }

  async filter(
    tenantId: string,
    filter: FilterUserDto,
    limit: number,
    page: number,
  ): Promise<{
    data: User[];
    total: number;
    totalPage: number;
    limit: number;
    page: number;
  }> {
    try {
      const query: any = { tenantId };
      if (filter.email !== undefined) {
        query.email = filter.email;
      }
      if (filter.name !== undefined) {
        query.name = { contains: filter.name, mode: 'insensitive' };
      }
      if (filter.phone !== undefined) {
        query.phone = filter.phone;
      }
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where: query,
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where: query }),
      ]);
      const userMap = users.map((user) => this.mapper.toAplication(user));
      return {
        data: userMap,
        total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failed to filter users');
      throw new BadRequestException('Failed to filter user ', {
        cause: error,
        description: error.message,
      });
    }
  }
  async findManagerByTenant(tenantId: string): Promise<User | null> {
    const manager = await this.prisma.user.findFirst({
      where: { tenantId, role: 'MANAGER' },
    });
    if (!manager) {
      throw new NotFoundException(`Manager does not exist`);
    }
    return this.mapper.toAplication(manager);
  }
  async updatePushSubscription(
    userId: string,
    subscription: PushSubscriptionType,
  ): Promise<User | null> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { pushSubscription: subscription },
      });
      return this.mapper.toAplication(user);
    } catch (error) {
      throw new BadRequestException(`Failled to add keys to description`);
    }
  }
  async findAllManager(): Promise<User[]> {
    try {
      const managers = await this.prisma.user.findMany({
        where: { role: 'MANAGER' },
        include: { tenant: { select: { name: true } } },
      });
      return managers.map((user) => this.mapper.toAplication(user));
    } catch (error) {
      this.logger.error('Failed to retrieve all managers', {
        error: error.message,
        stack: error.stack,
      });
      if (error.code === 'P2002') {
        throw new ConflictException('Database constraint violation');
      }

      throw new InternalServerErrorException(
        'Failed to retrieve all managers. Please try again later.',
        { cause: error },
      );
    }
  }
}
