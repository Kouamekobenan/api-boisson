import { DashbordDto } from 'src/dashbord/application/dtos/dashbord.dto';
import { DashboardSummary } from '../entities/dashbord.entity';
export class DashboardMapper {

  toEntity(data: DashbordDto): DashboardSummary {
    return new DashboardSummary(
      data.totalSales,
      data.totalDeliveries,
      data.totalRevenue,
    //   data.totalRevenueDeliverie,
      data.salesToday,
      data.deliveriesToday,
    );
  }
}
