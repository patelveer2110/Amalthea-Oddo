import { ExpensesService } from "./expenses.service";
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    findAll(query: any): Promise<({
        user: {
            email: string;
            fullName: string;
            id: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            defaultHourlyRate: import("@prisma/client/runtime/library").Decimal;
            timezone: string;
            createdAt: Date;
            updatedAt: Date;
        };
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        currency: string;
        notes: string | null;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        billable: boolean;
        date: Date;
        category: string;
        approved: boolean;
        reimbursed: boolean;
        receiptUrl: string | null;
    })[]>;
    create(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        currency: string;
        notes: string | null;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        billable: boolean;
        date: Date;
        category: string;
        approved: boolean;
        reimbursed: boolean;
        receiptUrl: string | null;
    }>;
    approve(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        currency: string;
        notes: string | null;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        billable: boolean;
        date: Date;
        category: string;
        approved: boolean;
        reimbursed: boolean;
        receiptUrl: string | null;
    }>;
    reimburse(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        currency: string;
        notes: string | null;
        userId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        billable: boolean;
        date: Date;
        category: string;
        approved: boolean;
        reimbursed: boolean;
        receiptUrl: string | null;
    }>;
}
//# sourceMappingURL=expenses.controller.d.ts.map