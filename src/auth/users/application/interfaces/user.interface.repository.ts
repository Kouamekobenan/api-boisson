import { User } from '../../domain/entities/user.entity';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { UserDto } from '../dtos/user.dto';

export interface IUserRepository {
  createUser(dataUser: UserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  deleteUser(userId: string): Promise<void>;
  getUserById(userId: string): Promise<User>;
  paginate(
    limit: number,
    page: number,
  ): Promise<{
    data: User[];
    totalPage: number;
    total: number;
    page: number;
    limit: number;
  }>;
  filter(
    filter: FilterUserDto,
    limit: number,
    page: number,
  ): Promise<{data:User[], total:number, totalPage:number, limit:number, page:number}>;
}
