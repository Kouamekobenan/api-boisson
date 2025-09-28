import { CreateTenantDto } from "src/tenant/application/dtos/create-tenant.dto"
import { Tenant } from "../entities/tenant.entity"
import { UpdateTenantDto } from "src/tenant/application/dtos/update-tenant";
import { UserDto } from "src/auth/users/application/dtos/user.dto";
import { User } from "src/auth/users/domain/entities/user.entity";

export const TenatRepositoryName ="ITenantRepository"
export interface ITenantRepository {
  create(dto: CreateTenantDto): Promise<Tenant>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Tenant | null>;
  update(id: string, updateDto: UpdateTenantDto): Promise<Tenant>;
  findAll(): Promise<Tenant[]>
  createEspace(user:UserDto, name:string):Promise<Tenant>
}
