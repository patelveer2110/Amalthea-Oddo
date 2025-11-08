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
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let TasksService = class TasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByProject(projectId) {
        // First check if the project exists
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                teamMembers: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        try {
            return await this.prisma.task.findMany({
                where: { projectId },
                include: {
                    assignee: true,
                    timesheets: true
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new common_1.NotFoundException(`Error fetching tasks: ${error.message}`);
            }
            throw error;
        }
    }
    async getProjectWithTeamMembers(projectId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                teamMembers: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        return project;
    }
    async validateAssignee(projectId, assigneeId) {
        const projectMember = await this.prisma.projectTeamMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: projectId,
                    userId: assigneeId
                }
            },
            include: {
                user: true
            }
        });
        if (!projectMember) {
            throw new common_1.BadRequestException(`User ${assigneeId} is not a member of this project`);
        }
        return projectMember;
    }
    async findById(id) {
        return this.prisma.task.findUnique({
            where: { id },
            include: { assignee: true, timesheets: true, comments: true },
        });
    }
    async create(projectId, data) {
        // Check if project exists and get project details
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                projectManager: true,
                teamMembers: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        // If assignee is provided, validate they are a team member
        if (data.assigneeId) {
            await this.validateAssignee(projectId, data.assigneeId);
        }
        // Create task data with proper validation
        const taskData = {
            ...data,
            projectId,
            // Only include assigneeId if it's provided and validated
            ...(data.assigneeId && { assigneeId: data.assigneeId }),
        };
        return this.prisma.task.create({
            data: taskData,
            include: {
                assignee: true,
                project: {
                    include: {
                        teamMembers: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            },
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
    async getTaskStatusAnalytics() {
        try {
            const taskCounts = await this.prisma.task.groupBy({
                by: ['state'],
                _count: {
                    id: true
                }
            });
            return taskCounts.map(count => ({
                name: count.state,
                value: count._count.id
            }));
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new common_1.BadRequestException(`Error getting task analytics: ${error.message}`);
            }
            throw error;
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map