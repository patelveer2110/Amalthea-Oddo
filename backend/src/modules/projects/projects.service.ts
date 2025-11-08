import { Injectable } from "@nestjs/common";
import  { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class ProjectsService {
  async getProjectMetrics(): Promise<{ totalProjects: number; totalRevenue: number; totalCost: number; totalProfit: number }> {
    // Basic aggregated project financial metrics across all projects
    const totalProjects = await this.prisma.project.count();

    const invoices = await this.prisma.customerInvoice.findMany({ select: { totalAmount: true } });
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount?.toNumber?.() ?? 0), 0);

    const timesheets = await this.prisma.timesheet.findMany({ select: { amount: true } });
    const timesheetCost = timesheets.reduce((sum, ts) => sum + (ts.amount?.toNumber?.() ?? 0), 0);

    const expenses = await this.prisma.expense.findMany({ select: { amount: true } });
    const expenseCost = expenses.reduce((sum, e) => sum + (e.amount?.toNumber?.() ?? 0), 0);

    const totalCost = timesheetCost + expenseCost;

    return {
      totalProjects,
      totalRevenue,
      totalCost,
      totalProfit: totalRevenue - totalCost,
    };
  }

  async getUtilizationTrend(): Promise<Array<{ month: string; utilization: number }>> {
    // Produce a simple utilization trend based on total hours logged per month
    const timesheets = await this.prisma.timesheet.findMany({ select: { workDate: true, durationHours: true } });

    const monthly = new Map<string, number>();

    timesheets.forEach((ts) => {
      const d = new Date(ts.workDate as any);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const hours = (ts.durationHours as any)?.toNumber?.() ?? Number(ts.durationHours) ?? 0;
      monthly.set(key, (monthly.get(key) ?? 0) + hours);
    });

    const result = Array.from(monthly.entries())
      .sort()
      .map(([month, hours]) => ({ month, utilization: Math.round(hours) }));

    return result;
  }
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
