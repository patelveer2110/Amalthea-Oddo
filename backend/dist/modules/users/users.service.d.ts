import { PrismaService } from "@/prisma/prisma.service";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        fullName: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }[]>;
    findById(id: string): Promise<{
        email: string;
        fullName: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        defaultHourlyRate: import("@prisma/client/runtime/library").Decimal;
        timezone: string;
        createdAt: Date;
    } | null>;
    update(id: string, data: any): Promise<{
        email: string;
        fullName: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
}
//# sourceMappingURL=users.service.d.ts.map