import { Injectable } from "@nestjs/common"
import { $Enums } from "@prisma/client"
import  { PrismaService } from "@/prisma/prisma.service"

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      include: { assignee: true, timesheets: true },
    })
  }

  async findById(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: { assignee: true, timesheets: true, comments: true },
    })
  }

  async create(projectId: string, data: any) {
    return this.prisma.task.create({
      data: { ...data, projectId },
      include: { assignee: true },
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
}
