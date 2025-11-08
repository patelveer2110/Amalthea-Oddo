import { Injectable } from "@nestjs/common";
import  { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: any) {
    return this.prisma.project.findMany({
      where: filters,
      include: {
        projectManager: {
          select: { id: true, fullName: true, email: true },
        },
        teamMembers: {
          select: {
            id: true,
            user: { select: { fullName: true, email: true } }, // ✅ fixed: fullName/email belong to user
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        projectManager: {
          select: { id: true, fullName: true, email: true },
        },
        teamMembers: {
          select: {
            id: true,
            user: { select: { fullName: true, email: true } }, // ✅ same fix
          },
        },
        tasks: true,
        timesheets: true,
        expenses: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.project.create({
      data,
      include: {
        projectManager: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async getFinancials(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        customerInvoices: true,
        timesheets: true,
        expenses: true,
      },
    });

    if (!project) return null;

    // ✅ Fixed: Prisma.Decimal requires .toNumber() to safely add
    const revenue = project.customerInvoices.reduce(
      (sum, inv) => sum + (inv.totalAmount?.toNumber?.() ?? 0),
      0,
    );

    const costs =
      project.timesheets.reduce(
        (sum, ts) => sum + (ts.amount?.toNumber?.() ?? 0),
        0,
      ) +
      project.expenses.reduce(
        (sum, exp) => sum + (exp.amount?.toNumber?.() ?? 0),
        0,
      );

    return {
      projectId,
      revenue,
      cost: costs,
      profit: revenue - costs,
      profitMargin: revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0,
    };
  }
}
