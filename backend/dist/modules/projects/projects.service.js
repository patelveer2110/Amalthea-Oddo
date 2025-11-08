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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
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
    async findById(id) {
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
    async create(data) {
        return this.prisma.project.create({
            data,
            include: {
                projectManager: {
                    select: { id: true, fullName: true, email: true },
                },
            },
        });
    }
    async update(id, data) {
        return this.prisma.project.update({
            where: { id },
            data,
        });
    }
    async getFinancials(projectId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                customerInvoices: true,
                timesheets: true,
                expenses: true,
            },
        });
        if (!project)
            return null;
        // ✅ Fixed: Prisma.Decimal requires .toNumber() to safely add
        const revenue = project.customerInvoices.reduce((sum, inv) => sum + (inv.totalAmount?.toNumber?.() ?? 0), 0);
        const costs = project.timesheets.reduce((sum, ts) => sum + (ts.amount?.toNumber?.() ?? 0), 0) +
            project.expenses.reduce((sum, exp) => sum + (exp.amount?.toNumber?.() ?? 0), 0);
        return {
            projectId,
            revenue,
            cost: costs,
            profit: revenue - costs,
            profitMargin: revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0,
        };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map