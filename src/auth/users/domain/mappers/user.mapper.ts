import { UserDto } from '../../application/dtos/user.dto';
import { PushSubscriptionType, User } from '../entities/user.entity';
import { Prisma, User as UserPrisma } from '@prisma/client';
import { UserRole as Role } from '../enums/role.enum';
export class UserMapper {
  toPersitence(data: UserDto): Prisma.UserCreateInput {
    return {
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: data.role,
      tenant: { connect: { id: data.tenantId } },
      // pushSubscription: data.pushSubscription,
    };
  }
  toAplication(
    Userdata: UserPrisma & { tenant?: { name: string } | null },
  ): User {
    return new User(
      Userdata.id,
      Userdata.email,
      Userdata.password,
      Userdata.name,
      Userdata.phone,
      Userdata.role as Role,
      Userdata.createdAt,
      Userdata.updatedAt,
      Userdata.tenantId,
      Userdata.pushSubscription as PushSubscriptionType,
      Userdata?.tenant?.name,
    );
  }
  toUpdateUser(userData: UserDto): any {
    return {
      email: userData.email,
      password: userData.password,
      role: userData.role,
    };
  }
}
