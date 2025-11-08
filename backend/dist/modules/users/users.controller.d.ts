import { UsersService } from "./users.service";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
}
//# sourceMappingURL=users.controller.d.ts.map