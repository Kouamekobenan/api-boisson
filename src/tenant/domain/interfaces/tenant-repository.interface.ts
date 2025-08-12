import { CreateTenantDto } from "src/tenant/application/dtos/create-tenant.dto"
import { Tenant } from "../entities/tenant.entity"
import { UpdateTenantDto } from "src/tenant/application/dtos/update-tenant";

export const TenatRepositoryName ="ITenantRepository"
export interface ITenantRepository {
  create(dto: CreateTenantDto): Promise<Tenant>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Tenant | null>;
  update(id: string, updateDto: UpdateTenantDto): Promise<Tenant>;
}
