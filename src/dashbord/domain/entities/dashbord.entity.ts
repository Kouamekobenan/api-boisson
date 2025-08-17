export class DashboardSummary {
  constructor(
    private totalSales: number,
    private totalDeliveries: number,
    private totalRevenue: number,
    // private totalRevenueDeliverie:number,
    private salesToday: number,
    private deliveriesToday: number,
  ) {}
  get TotalSales(): number {
    return this.totalSales;
  }
  get TotalDeliveries(): number {
    return this.totalDeliveries;
  }
  get TotalRevenu(): number {
    return this.totalRevenue;
  }
  get SalesToday(): number {
    return this.salesToday;
  }
  get DeliveriesToday(): number {
    return this.deliveriesToday;
  }
//   get TotalRevenueDeliverie():number{
//     return this.totalRevenueDeliverie;
//   }
}
