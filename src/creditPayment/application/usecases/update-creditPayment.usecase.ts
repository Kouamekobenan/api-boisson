import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { CreditPaymentRepositoryName, ICreditPaymentRepository } from "src/creditPayment/domain/interfaces/creditPayment-repository.interface";
import { UpdateCreditPaymentDto } from "../dtos/update-creditPayment";
import { CreditPayment } from "src/creditPayment/domain/entities/creditPayment.entity";

@Injectable()
export class UpdateCreditPaymentUseCase{
    private logger = new Logger(UpdateCreditPaymentUseCase.name)
    constructor(
        @Inject(CreditPaymentRepositoryName)
        private readonly creditPaymentRepository : ICreditPaymentRepository
    ){}
    async execute(id:string, dto:UpdateCreditPaymentDto):Promise<CreditPayment>{
        try {
            return await this.creditPaymentRepository.update(id, dto)
        } catch (error) {
            this.logger.error('Failled to update creditPayment', error.message)
            throw new BadRequestException("Failled to update creditPayment", {cause:error, description:error.message})
        }
    }
}
