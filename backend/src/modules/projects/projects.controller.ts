import { Controller, Get, Post, Put, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "@/common/guards/jwt.guard"
import  { ProjectsService } from "./projects.service"

@ApiTags("Projects")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("api/v1/projects")
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async findAll() {
    return this.projectsService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  @Get(':id/financials')
  async getFinancials(@Param('id') id: string) {
    return this.projectsService.getFinancials(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.projectsService.create(body);
  }

  @Put(":id")
  async update(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.update(id, body)
  }
}
