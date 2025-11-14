import { UserRole } from '../enums/role.enum';

export type PushSubscriptionType = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export class User {
  constructor(
    private readonly id: string,
    private email: string,
    private password: string,
    private name: string | null,
    private phone: string | null,
    private role: UserRole,
    private createdAt: Date,
    private updatedAt: Date,
    private tenantId: string | null,
    private pushSubscription: PushSubscriptionType | null,
    private tenantName?: string,
  ) {}

  // ----- Getters -----
  getId(): string {
    return this.id;
  }

  getTenantId(): string | null {
    return this.tenantId;
  }

  getEmail(): string {
    return this.email;
  }

  getRole(): UserRole {
    return this.role;
  }

  getPassword(): string {
    return this.password;
  }

  getName(): string | null {
    return this.name;
  }

  getPhone(): string | null {
    return this.phone;
  }

  getPushSubscription(): PushSubscriptionType | null | undefined {
    return this.pushSubscription;
  }
}
