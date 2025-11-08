import { TasksService } from "./tasks.service";
import { $Enums } from "@prisma/client";
declare class MoveTaskDto {
    state: $Enums.TaskState;
}
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
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
    create(projectId: string, body: any): Promise<{
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
    update(id: string, body: any): Promise<{
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
    moveTask(id: string, body: MoveTaskDto): Promise<{
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
export {};
//# sourceMappingURL=tasks.controller.d.ts.map