import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { $Enums, Prisma } from "@prisma/client"
import { PrismaService } from "@/prisma/prisma.service"
import { CreateTaskDto } from "./dto/create-task.dto"

interface TaskStatusCount {
  name: string;
  value: number;
}

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findByProject(projectId: string) {
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
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    try {
      return await this.prisma.task.findMany({
        where: { projectId },
        include: { 
          assignee: true, 
          timesheets: true 
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundException(`Error fetching tasks: ${error.message}`);
      }
      throw error;
    }
  }

  async getProjectWithTeamMembers(projectId: string) {
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
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return project;
  }

  private async validateAssignee(projectId: string, assigneeId: string) {
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
      throw new BadRequestException(`User ${assigneeId} is not a member of this project`);
    }

    return projectMember;
  }

  async findById(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: { assignee: true, timesheets: true, comments: true },
    })
  }

  async create(projectId: string, data: CreateTaskDto) {
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
      throw new NotFoundException(`Project with ID ${projectId} not found`);
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
    }

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
    })
  }

  async update(id: string, data: any) {
    return this.prisma.task.update({
      where: { id },
      data,
    })
  }

  async moveTask(id: string, newState: $Enums.TaskState) {
    return this.prisma.task.update({
      where: { id },
      data: { state: newState },
    })
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(`Error getting task analytics: ${error.message}`);
      }
      throw error;
    }
  }
}
