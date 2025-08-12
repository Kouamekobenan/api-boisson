import { Injectable } from '@nestjs/common';
@Injectable()
export class Tenant {
  constructor(
    private readonly id: string,
    private name: string,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}
  get Id():string{
    return this.id
  }
  get Name():string{
    return this.name
  }
  
}
