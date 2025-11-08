"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FinanceService = class FinanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInvoiceFromTimesheets(projectId, timesheetIds) {
        return await this.prisma.$transaction(async (tx) => {
            // ✅ Validate all timesheets exist, are approved, and not already invoiced
            const timesheets = await tx.timesheet.findMany({
                where: { id: { in: timesheetIds }, projectId },
                include: { user: true, task: true },
            });
            if (timesheets.length !== timesheetIds.length) {
                throw new common_1.BadRequestException("Some timesheets not found");
            }
            const invalidTimesheets = timesheets.filter((ts) => ts.status !== "APPROVED" || ts.invoiced);
            if (invalidTimesheets.length > 0) {
                throw new common_1.BadRequestException("Some timesheets are not approved or already invoiced");
            }
            // ✅ Safely sum Prisma.Decimal or number
            const totalAmount = timesheets.reduce((sum, ts) => sum +
                (typeof ts.amount === "object" && "toNumber" in ts.amount
                    ? ts.amount.toNumber()
                    : ts.amount || 0), 0);
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
            const invoiceLines = await Promise.all(timesheets.map((ts) => tx.invoiceLine.create({
                data: {
                    invoiceId: invoice.id,
                    description: `Time: ${ts.task?.title || "Project Work"}${ts.notes ? " - " + ts.notes : ""}`,
                    quantity: ts.durationHours ?? 0,
                    unitPrice: typeof ts.hourlyRate === "object" &&
                        "toNumber" in ts.hourlyRate
                        ? ts.hourlyRate.toNumber()
                        : ts.hourlyRate ?? 0,
                    amount: typeof ts.amount === "object" && "toNumber" in ts.amount
                        ? ts.amount.toNumber()
                        : ts.amount ?? 0,
                    timesheetId: ts.id,
                },
            })));
            // ✅ Mark timesheets as invoiced
            await Promise.all(timesheetIds.map((id) => tx.timesheet.update({
                where: { id },
                data: { invoiced: true, invoiceId: invoice.id },
            })));
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
                    totalAmount: typeof invoice.totalAmount === "object" &&
                        "toNumber" in invoice.totalAmount
                        ? invoice.totalAmount.toNumber()
                        : invoice.totalAmount,
                    createdAt: invoice.createdAt,
                },
                invoiceLines: invoiceLines.map((line) => ({
                    id: line.id,
                    description: line.description,
                    quantity: line.quantity,
                    unitPrice: typeof line.unitPrice === "object" && "toNumber" in line.unitPrice
                        ? line.unitPrice.toNumber()
                        : line.unitPrice,
                    amount: typeof line.amount === "object" && "toNumber" in line.amount
                        ? line.amount.toNumber()
                        : line.amount,
                })),
                timesheetsInvoiced: timesheetIds.length,
            };
        });
    }
    async getSalesOrders(filters) {
        return this.prisma.salesOrder.findMany({
            where: filters,
            include: { project: true },
        });
    }
    async createSalesOrder(data) {
        return this.prisma.salesOrder.create({
            data,
        });
    }
    async getInvoices(projectId) {
        return this.prisma.customerInvoice.findMany({
            where: projectId ? { projectId } : undefined,
            include: { project: true, invoiceLines: true },
        });
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map