import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/role.enum';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { UserDto } from '../dtos/user.dto';

export type PushSubscriptionType = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};
export interface IUserRepository {
  createUser(dataUser: UserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  getAllUsers(tenantId: string): Promise<User[]>;
  deleteUser(userId: string): Promise<void>;
  getUserById(userId: string): Promise<User>;
  paginate(
    tenantId: string,
    page: number,
    limit: number,
    search?: FilterUserDto,
    role?: UserRole | 'ALL',
  ): Promise<{
    data: User[];
    totalPage: number;
    total: number;
    page: number;
    limit: number;
  }>;
  filter(
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
  }>;
  findManagerByTenant(tenantId: string): Promise<User | null>;
  updatePushSubscription(
    userId:string,
    subscription: PushSubscriptionType,
  ): Promise<User | null>;
}
