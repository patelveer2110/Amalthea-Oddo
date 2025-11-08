import { Controller, Get, Post, Put, Param, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "@/common/guards/jwt.guard"
import  { ExpensesService } from "./expenses.service"

@ApiTags("Expenses")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("api/v1/expenses")
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  async findAll(query: any) {
    const filters: any = {}
    if (query.project) filters.projectId = query.project
    if (query.approved) filters.approved = query.approved === "true"
    return this.expensesService.findAll(filters)
  }

  @Post()
  async create(@Body() body: any) {
    return this.expensesService.create(body);
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string) {
    return this.expensesService.approve(id);
  }

  @Put(':id/reimburse')
  async reimburse(@Param('id') id: string) {
    return this.expensesService.reimburse(id);
  }
}
