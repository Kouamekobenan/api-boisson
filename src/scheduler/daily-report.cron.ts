import * as cron from 'node-cron';
import * as webPush from 'web-push'; // ✅ CORRECTION
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  DashbordRepositoryName,
  IDashbordRepository,
} from 'src/dashbord/domain/interfaces/repository-dashbord.interface';
import { IUserRepository } from 'src/auth/users/application/interfaces/user.interface.repository';
import {
  ITenantRepository,
  TenatRepositoryName,
} from 'src/tenant/domain/interfaces/tenant-repository.interface';

@Injectable()
export class StartDailyReportJob implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(StartDailyReportJob.name);
  private readonly cronJobs: Map<string, any> = new Map();
  // private readonly CRON_SCHEDULE = '0 19 * * *';
  private readonly CRON_SCHEDULE = '30 2 * * *';

  constructor(
    @Inject(DashbordRepositoryName)
    private readonly dashbordRepo: IDashbordRepository,
    @Inject(TenatRepositoryName)
    private readonly tenantRepo: ITenantRepository,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {
    this.configureWebPush();
  }

  private configureWebPush(): void {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const email = process.env.VAPID_EMAIL || 'mailto:admin@example.com';

    if (!publicKey || !privateKey) {
      this.logger.error('❌ VAPID keys not configured');
      throw new Error('VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY are required');
    }

    // ✅ CORRECTION: webPush est maintenant correctement importé
    webPush.setVapidDetails(email, publicKey, privateKey);
    this.logger.log('✅ Web Push configured successfully');
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('🚀 Initializing daily report jobs...');
    try {
      await this.startAllTenantsJobs();
    } catch (error) {
      this.logger.error('❌ Error initializing jobs', error.stack);
    }
  }

  onModuleDestroy(): void {
    this.logger.log('🛑 Stopping all cron jobs...');
    this.cronJobs.forEach((job, tenantId) => {
      try {
        job.task.stop();
        this.logger.log(`✅ Stopped job for tenant ${tenantId}`);
      } catch (error) {
        this.logger.error(`❌ Error stopping job for ${tenantId}`, error.stack);
      }
    });
    this.cronJobs.clear();
  }

  private async startAllTenantsJobs(): Promise<void> {
    const tenants = await this.tenantRepo.findAll();

    if (!tenants || tenants.length === 0) {
      this.logger.warn('⚠️ No tenants found');
      return;
    }

    this.logger.log(`📋 Found ${tenants.length} tenant(s)`);

    for (const tenant of tenants) {
      if (tenant.Id) {
        await this.scheduleDailyReport(tenant.Id);
      }
    }
  }

  private async scheduleDailyReport(tenantId: string): Promise<void> {
    if (this.cronJobs.has(tenantId)) {
      return;
    }

    const task = cron.schedule(
      this.CRON_SCHEDULE,
      async () => {
        await this.executeDailyReport(tenantId);
      },
      { timezone: 'Africa/Abidjan' },
    );

    this.cronJobs.set(tenantId, {
      tenantId,
      task,
      createdAt: new Date(),
    });

    this.logger.log(`✅ Scheduled job for tenant ${tenantId}`);
  }

  private async executeDailyReport(tenantId: string): Promise<void> {
    this.logger.log(`🕖 Executing daily report for tenant ${tenantId}`);

    try {
      const report = await this.dashbordRepo.sammary(tenantId);
      const manager = await this.userRepo.findManagerByTenant(tenantId);

      if (!manager) {
        this.logger.warn(`No manager found for tenant ${tenantId}`);
        return;
      }

      const subscription = manager.getPushSubscription();
      if (!subscription) {
        this.logger.warn(`Manager ${manager.getId()} has no push subscription`);
        return;
      }

      const payload = JSON.stringify({
        title: '📊 Rapport Journalier',
        body: `💰 Ventes : ${report.SalesToday} FCFA | 🚚 Livraisons : ${report.DeliveriesToday}`,
      });

      // ✅ webPush fonctionne maintenant correctement
      await webPush.sendNotification(subscription, payload);

      this.logger.log(`✅ Notification sent to ${manager.getEmail()}`);
    } catch (error: any) {
      this.logger.error(
        `❌ Error sending notification for ${tenantId}: ${error.message}`,
        error.stack,
      );
    }
  }

  // API publique pour gestion dynamique
  public async addTenantJob(tenantId: string): Promise<void> {
    if (!tenantId) {
      throw new BadRequestException('Tenant ID required');
    }
    await this.scheduleDailyReport(tenantId);
  }

  public removeTenantJob(tenantId: string): void {
    const job = this.cronJobs.get(tenantId);
    if (job) {
      job.task.stop();
      this.cronJobs.delete(tenantId);
      this.logger.log(`✅ Removed job for tenant ${tenantId}`);
    }
  }
}
