import { Injectable } from "@nestjs/common"
import  { PrismaService } from "@/prisma/prisma.service"

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.expense.create({
      data: {
        ...data,
        approved: false,
        reimbursed: false,
      },
    })
  }

  async findAll(filters?: any) {
    return this.prisma.expense.findMany({
      where: filters,
      include: { user: true, project: true },
    })
  }

  async approve(id: string) {
    return this.prisma.expense.update({
      where: { id },
      data: { approved: true },
    })
  }

  async reimburse(id: string) {
    return this.prisma.expense.update({
      where: { id },
      data: { reimbursed: true },
    })
  }
}
