import { $Enums, Prisma } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
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
            notes: string | null;
            userId: string;
            taskId: string | null;
            workDate: Date;
            durationHours: Prisma.Decimal;
            hourlyRate: Prisma.Decimal;
            amount: Prisma.Decimal;
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
            defaultHourlyRate: Prisma.Decimal;
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
        estimateHours: Prisma.Decimal | null;
    })[]>;
    getProjectWithTeamMembers(projectId: string): Promise<{
        teamMembers: ({
            user: {
                email: string;
                fullName: string;
                id: string;
                passwordHash: string;
                role: $Enums.UserRole;
                status: $Enums.UserStatus;
                defaultHourlyRate: Prisma.Decimal;
                timezone: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            role: string;
            projectId: string;
            userId: string;
            addedAt: Date;
        })[];
    } & {
        id: string;
        status: $Enums.ProjectStatus;
        defaultHourlyRate: Prisma.Decimal | null;
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
        budgetAmount: Prisma.Decimal | null;
        billableFlag: boolean;
        projectType: $Enums.ProjectType;
    }>;
    private validateAssignee;
    findById(id: string): Promise<({
        timesheets: {
            id: string;
            status: $Enums.TimesheetStatus;
            createdAt: Date;
            updatedAt: Date;
            projectId: string;
            notes: string | null;
            userId: string;
            taskId: string | null;
            workDate: Date;
            durationHours: Prisma.Decimal;
            hourlyRate: Prisma.Decimal;
            amount: Prisma.Decimal;
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
            defaultHourlyRate: Prisma.Decimal;
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
        estimateHours: Prisma.Decimal | null;
    }) | null>;
    create(projectId: string, data: CreateTaskDto): Promise<{
        project: {
            teamMembers: ({
                user: {
                    email: string;
                    fullName: string;
                    id: string;
                    passwordHash: string;
                    role: $Enums.UserRole;
                    status: $Enums.UserStatus;
                    defaultHourlyRate: Prisma.Decimal;
                    timezone: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                role: string;
                projectId: string;
                userId: string;
                addedAt: Date;
            })[];
        } & {
            id: string;
            status: $Enums.ProjectStatus;
            defaultHourlyRate: Prisma.Decimal | null;
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
            budgetAmount: Prisma.Decimal | null;
            billableFlag: boolean;
            projectType: $Enums.ProjectType;
        };
        assignee: {
            email: string;
            fullName: string;
            id: string;
            passwordHash: string;
            role: $Enums.UserRole;
            status: $Enums.UserStatus;
            defaultHourlyRate: Prisma.Decimal;
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
        estimateHours: Prisma.Decimal | null;
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
        estimateHours: Prisma.Decimal | null;
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
        estimateHours: Prisma.Decimal | null;
    }>;
    getTaskStatusAnalytics(): Promise<{
        name: $Enums.TaskState;
        value: number;
    }[]>;
}
//# sourceMappingURL=tasks.service.d.ts.map