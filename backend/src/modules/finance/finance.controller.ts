import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiBody } from "@nestjs/swagger"
import { JwtAuthGuard } from "@/common/guards/jwt.guard"
import { RbacGuard } from "@/common/guards/rbac.guard"
import { Roles } from "@/common/decorators/roles.decorator"
import  { FinanceService } from "./finance.service"

@ApiTags("Finance")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("api/v1/finance")
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get("sales-orders")
  async getSalesOrders(query: any) {
    return this.financeService.getSalesOrders()
  }

  @Post('sales-orders')
  @UseGuards(RbacGuard)
  @Roles('ADMIN', 'FINANCE')
  async createSalesOrder(@Body() body: any) {
    return this.financeService.createSalesOrder(body);
  }

  @Get("invoices")
  async getInvoices(projectId?: string) {
    return this.financeService.getInvoices(projectId)
  }

  @Post('invoices/from-timesheets')
  @UseGuards(RbacGuard)
  @Roles('ADMIN', 'FINANCE', 'PROJECT_MANAGER')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        timesheet_ids: { type: 'array', items: { type: 'string' } },
      },
      required: ['project_id', 'timesheet_ids'],
    },
  })
  async createInvoiceFromTimesheets(
    @Body() body: { project_id: string; timesheet_ids: string[] },
  ) {
    return this.financeService.createInvoiceFromTimesheets(body.project_id, body.timesheet_ids);
  }
}
