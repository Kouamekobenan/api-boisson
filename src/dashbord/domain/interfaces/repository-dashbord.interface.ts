import { DashboardSummary } from '../entities/dashbord.entity';

export const DashbordRepositoryName = 'IDashbordRepository';
export interface IDashbordRepository {
  sammary(tenantId: string): Promise<DashboardSummary>;
  getSalesByDay(
    tenantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ total: number }>;
}
