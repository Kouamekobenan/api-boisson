import * as cron from 'node-cron';
import webPush from 'web-push';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
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
export class StartDailyReportJob implements OnModuleInit {
  private readonly logger = new Logger(StartDailyReportJob.name);

  constructor(
    @Inject(DashbordRepositoryName)
    private readonly dashbordRepo: IDashbordRepository,
    @Inject(TenatRepositoryName)
    private readonly tenantRepo: ITenantRepository,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  // --- Démarrage automatique au chargement du module ---
  onModuleInit() {
    this.logger.log('Initialisation du job de rapport journalier...');
    this.startAllTenantsJobs();
  }

  // --- Planifier un cron pour chaque tenant existant ---
  private async startAllTenantsJobs() {
    const tenants = await this.tenantRepo.findAll(); // retourne Tenant[]

    tenants.forEach((tenant) => {
      if (!tenant.Id) {
        this.logger.warn('Tenant sans ID trouvé, ignoré');
        return;
      }
      this.scheduleDailyReport(tenant.Id);
    });
  }
  // --- Planifie la tâche quotidienne pour un tenant ---
  private scheduleDailyReport(tenantId: string) {
    cron.schedule('0 19 * * *', async () => {
      this.logger.log(
        `🕖 Exécution du rapport journalier pour le tenant ${tenantId}...`,
      );
      try {
        // 1️⃣ Récupérer le rapport
        const report = await this.dashbordRepo.sammary(tenantId);

        // 2️⃣ Récupérer le manager
        const manager = await this.userRepo.findManagerByTenant(tenantId);
        if (!manager) {
          this.logger.warn(`Aucun manager trouvé pour le tenant ${tenantId}`);
          return;
        }

        // 3️⃣ Vérifier la pushSubscription
        const managerSubscription = manager.getPushSubscription();
        if (!managerSubscription) {
          this.logger.warn(
            `Le manager ${manager.getId()} n’a pas de pushSubscription`,
          );
          return;
        }

        // 4️⃣ Construire et envoyer la notification
        const payload = JSON.stringify({
          title: 'Rapport Journalier',
          body: `Ventes : ${report.SalesToday} FCFA | Livraisons : ${report.DeliveriesToday}`,
        });

        await webPush.sendNotification(managerSubscription, payload);
        this.logger.log(
          `✅ Notification envoyée au manager ${manager.getEmail()}`,
        );
      } catch (error: any) {
        this.logger.error(
          `❌ Erreur lors de l'envoi de la notification: ${error.message}`,
        );
        throw new BadRequestException(
          'Erreur lors de l’envoi de la notification',
          {
            cause: error,
            description: error.message,
          },
        );
      }
    });
  }
}
