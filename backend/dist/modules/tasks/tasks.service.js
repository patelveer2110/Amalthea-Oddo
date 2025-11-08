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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TasksService = class TasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByProject(projectId) {
        return this.prisma.task.findMany({
            where: { projectId },
            include: { assignee: true, timesheets: true },
        });
    }
    async findById(id) {
        return this.prisma.task.findUnique({
            where: { id },
            include: { assignee: true, timesheets: true, comments: true },
        });
    }
    async create(projectId, data) {
        return this.prisma.task.create({
            data: { ...data, projectId },
            include: { assignee: true },
        });
    }
    async update(id, data) {
        return this.prisma.task.update({
            where: { id },
            data,
        });
    }
    async moveTask(id, newState) {
        return this.prisma.task.update({
            where: { id },
            data: { state: newState },
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map