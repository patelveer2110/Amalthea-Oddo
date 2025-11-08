import { $Enums } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    findByProject(projectId: string): Promise<({
        timesheets: {
            id: string;
            status: $Enums.TimesheetStatus;
            createdAt: Date;
            updatedAt: Date;
            projectId: string;
            userId: string;
            notes: string | null;
            taskId: string | null;
            workDate: Date;
            durationHours: import("@prisma/client/runtime/library").Decimal;
            hourlyRate: import("@prisma/client/runtime/library").Decimal;
            amount: import("@prisma/client/runtime/library").Decimal;
            billable: boolean;
            invoiced: boolean;
            invoiceId: string | null;
        }[];
        assignee: {
            email: string;
            fullName: string;
            id: string;
            passwordHash: string;
            role: $Enums.UserRole;
            status: $Enums.UserStatus;
            defaultHourlyRate: import("@prisma/client/runtime/library").Decimal;
            timezone: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        projectId: string;
        dueDate: Date | null;
        title: string;
        state: $Enums.TaskState;
        priority: $Enums.TaskPriority;
        assigneeId: string | null;
        estimateHours: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    findById(id: string): Promise<({
        timesheets: {
            id: string;
            status: $Enums.TimesheetStatus;
            createdAt: Date;
            updatedAt: Date;
            projectId: string;
            userId: string;
            notes: string | null;
            taskId: string | null;
            workDate: Date;
            durationHours: import("@prisma/client/runtime/library").Decimal;
            hourlyRate: import("@prisma/client/runtime/library").Decimal;
            amount: import("@prisma/client/runtime/library").Decimal;
            billable: boolean;
            invoiced: boolean;
            invoiceId: string | null;
        }[];
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            projectId: string | null;
            taskId: string | null;
            invoiceId: string | null;
            entityType: string;
            entityId: string;
            timesheetId: string | null;
            expenseId: string | null;
            billId: string | null;
            authorId: string;
            content: string;
            mentions: string[];
        }[];
        assignee: {
            email: string;
            fullName: string;
            id: string;
            passwordHash: string;
            role: $Enums.UserRole;
            status: $Enums.UserStatus;
            defaultHourlyRate: import("@prisma/client/runtime/library").Decimal;
            timezone: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        projectId: string;
        dueDate: Date | null;
        title: string;
        state: $Enums.TaskState;
        priority: $Enums.TaskPriority;
        assigneeId: string | null;
        estimateHours: import("@prisma/client/runtime/library").Decimal | null;
    }) | null>;
    create(projectId: string, data: any): Promise<{
        assignee: {
            email: string;
            fullName: string;
            id: string;
            passwordHash: string;
            role: $Enums.UserRole;
            status: $Enums.UserStatus;
            defaultHourlyRate: import("@prisma/client/runtime/library").Decimal;
            timezone: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        projectId: string;
        dueDate: Date | null;
        title: string;
        state: $Enums.TaskState;
        priority: $Enums.TaskPriority;
        assigneeId: string | null;
        estimateHours: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        projectId: string;
        dueDate: Date | null;
        title: string;
        state: $Enums.TaskState;
        priority: $Enums.TaskPriority;
        assigneeId: string | null;
        estimateHours: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    moveTask(id: string, newState: $Enums.TaskState): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        projectId: string;
        dueDate: Date | null;
        title: string;
        state: $Enums.TaskState;
        priority: $Enums.TaskPriority;
        assigneeId: string | null;
        estimateHours: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
//# sourceMappingURL=tasks.service.d.ts.map