import { PrismaService } from "@/prisma/prisma.service";
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    createInvoiceFromTimesheets(projectId: string, timesheetIds: string[]): Promise<{
        invoice: {
            id: string;
            number: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            totalAmount: number;
            createdAt: Date;
        };
        invoiceLines: {
            id: string;
            description: string;
            quantity: import("@prisma/client/runtime/library").Decimal;
            unitPrice: number;
            amount: number;
        }[];
        timesheetsInvoiced: number;
    }>;
    getSalesOrders(filters?: any): Promise<({
        project: {
            id: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            defaultHourlyRate: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            currency: string;
            code: string;
            customerId: string | null;
            projectManagerId: string;
            startDate: Date;
            endDate: Date | null;
            budgetAmount: import("@prisma/client/runtime/library").Decimal | null;
            billableFlag: boolean;
            projectType: import(".prisma/client").$Enums.ProjectType;
        } | null;
    } & {
        number: string;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        projectId: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        customerId: string | null;
        customerName: string | null;
    })[]>;
    createSalesOrder(data: any): Promise<{
        number: string;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        projectId: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        customerId: string | null;
        customerName: string | null;
    }>;
    getInvoices(projectId?: string): Promise<({
        project: {
            id: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            defaultHourlyRate: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            currency: string;
            code: string;
            customerId: string | null;
            projectManagerId: string;
            startDate: Date;
            endDate: Date | null;
            budgetAmount: import("@prisma/client/runtime/library").Decimal | null;
            billableFlag: boolean;
            projectType: import(".prisma/client").$Enums.ProjectType;
        } | null;
        invoiceLines: {
            id: string;
            createdAt: Date;
            description: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
            timesheetId: string | null;
            expenseId: string | null;
            quantity: import("@prisma/client/runtime/library").Decimal;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        number: string;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        projectId: string | null;
        sourceSoId: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        dueDate: Date | null;
        notes: string | null;
    })[]>;
}
//# sourceMappingURL=finance.service.d.ts.map