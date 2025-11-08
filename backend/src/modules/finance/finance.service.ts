import { Injectable, BadRequestException } from "@nestjs/common";
import  { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async createInvoiceFromTimesheets(projectId: string, timesheetIds: string[]) {
    return await this.prisma.$transaction(async (tx) => {
      // ✅ Validate all timesheets exist, are approved, and not already invoiced
      const timesheets = await tx.timesheet.findMany({
        where: { id: { in: timesheetIds }, projectId },
        include: { user: true, task: true },
      });

      if (timesheets.length !== timesheetIds.length) {
        throw new BadRequestException("Some timesheets not found");
      }

      const invalidTimesheets = timesheets.filter(
        (ts) => ts.status !== "APPROVED" || ts.invoiced,
      );

      if (invalidTimesheets.length > 0) {
        throw new BadRequestException(
          "Some timesheets are not approved or already invoiced",
        );
      }

      // ✅ Safely sum Prisma.Decimal or number
      const totalAmount = timesheets.reduce(
        (sum, ts) =>
          sum +
          (typeof ts.amount === "object" && "toNumber" in ts.amount
            ? ts.amount.toNumber()
            : ts.amount || 0),
        0,
      );

      const invoiceNumber = `INV-${Date.now()}`;

      // ✅ Create invoice
      const invoice = await tx.customerInvoice.create({
        data: {
          number: invoiceNumber,
          projectId,
          status: "DRAFT",
          totalAmount,
          currency: "USD",
        },
      });

      // ✅ Create invoice lines from timesheets (snapshot data)
      const invoiceLines = await Promise.all(
        timesheets.map((ts) =>
          tx.invoiceLine.create({
            data: {
              invoiceId: invoice.id,
              description: `Time: ${ts.task?.title || "Project Work"}${
                ts.notes ? " - " + ts.notes : ""
              }`,
              quantity: ts.durationHours ?? 0,
              unitPrice:
                typeof ts.hourlyRate === "object" &&
                "toNumber" in ts.hourlyRate
                  ? ts.hourlyRate.toNumber()
                  : ts.hourlyRate ?? 0,
              amount:
                typeof ts.amount === "object" && "toNumber" in ts.amount
                  ? ts.amount.toNumber()
                  : ts.amount ?? 0,
              timesheetId: ts.id,
            },
          }),
        ),
      );

      // ✅ Mark timesheets as invoiced
      await Promise.all(
        timesheetIds.map((id) =>
          tx.timesheet.update({
            where: { id },
            data: { invoiced: true, invoiceId: invoice.id },
          }),
        ),
      );

      // ✅ Create audit log
      await tx.auditLog.create({
        data: {
          action: "INVOICE_CREATED",
          entityType: "CUSTOMER_INVOICE",
          entityId: invoice.id,
          details: `Created invoice from ${timesheetIds.length} timesheets`,
          createdAt: new Date(),
        },
      });

      return {
        invoice: {
          id: invoice.id,
          number: invoice.number,
          status: invoice.status,
          totalAmount:
            typeof invoice.totalAmount === "object" &&
            "toNumber" in invoice.totalAmount
              ? invoice.totalAmount.toNumber()
              : invoice.totalAmount,
          createdAt: invoice.createdAt,
        },
        invoiceLines: invoiceLines.map((line) => ({
          id: line.id,
          description: line.description,
          quantity: line.quantity,
          unitPrice:
            typeof line.unitPrice === "object" && "toNumber" in line.unitPrice
              ? line.unitPrice.toNumber()
              : line.unitPrice,
          amount:
            typeof line.amount === "object" && "toNumber" in line.amount
              ? line.amount.toNumber()
              : line.amount,
        })),
        timesheetsInvoiced: timesheetIds.length,
      };
    });
  }

  async getSalesOrders(filters?: any) {
    return this.prisma.salesOrder.findMany({
      where: filters,
      include: { project: true },
    });
  }

  async createSalesOrder(data: any) {
    return this.prisma.salesOrder.create({
      data,
    });
  }

  async getInvoices(projectId?: string) {
    return this.prisma.customerInvoice.findMany({
      where: projectId ? { projectId } : undefined,
      include: { project: true, invoiceLines: true },
    });
  }
}
